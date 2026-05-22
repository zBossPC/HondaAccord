import { create } from "zustand";
import type { Room, RemoteParticipant, RemoteTrackPublication } from "livekit-client";
import { loadLiveKit } from "../lib/livekit";
import { supabase, livekitUrl } from "../lib/supabase";
import type { VoicePresence } from "../types";

export interface LiveParticipant {
  identity: string;
  name: string;
  isSpeaking: boolean;
  isMuted: boolean;
  videoTrack?: MediaStreamTrack | null;
}

type ScreenShareQuality = "standard" | "high" | "ultra";

interface VoiceState {
  connected: boolean;
  connecting: boolean;
  channelId: string | null;
  channelName: string | null;
  spaceName: string | null;
  spaceId: string | null;
  muted: boolean;
  deafened: boolean;
  screenSharing: boolean;
  screenShareQuality: ScreenShareQuality;
  liveParticipants: LiveParticipant[];
  voicePresence: VoicePresence[];
  error: string | null;
  join: (
    channelId: string,
    channelName: string,
    spaceName: string,
    spaceId: string,
    profileId: string,
    displayName: string,
  ) => Promise<void>;
  leave: () => Promise<void>;
  toggleMute: () => Promise<void>;
  toggleDeafen: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  setScreenShareQuality: (q: ScreenShareQuality) => void;
  refreshPresence: () => Promise<void>;
  subscribePresence: (channelId: string) => () => void;
}

const roomRef: { current: Room | null } = { current: null };
const preDeafenMutedRef = { current: false };
let presenceUnsub: (() => void) | null = null;
let profileIdRef = "";
let displayNameRef = "";

function syncParticipants(set: (partial: Partial<VoiceState>) => void) {
  const room = roomRef.current;
  if (!room) return;

  const list: LiveParticipant[] = [];

  const addParticipant = (identity: string, name: string, isLocal: boolean) => {
    const p = isLocal ? room.localParticipant : room.remoteParticipants.get(identity);
    if (!p) return;

    let videoTrack: MediaStreamTrack | null = null;
    p.videoTrackPublications.forEach((pub) => {
      if (pub.track && pub.source === "screen_share") {
        videoTrack = pub.track.mediaStreamTrack;
      }
    });

    list.push({
      identity,
      name,
      isSpeaking: p.isSpeaking,
      isMuted: !p.isMicrophoneEnabled,
      videoTrack,
    });
  };

  addParticipant(room.localParticipant.identity, displayNameRef || "You", true);
  room.remoteParticipants.forEach((p: RemoteParticipant) => {
    addParticipant(p.identity, p.name ?? p.identity, false);
  });

  set({ liveParticipants: list });
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  connected: false,
  connecting: false,
  channelId: null,
  channelName: null,
  spaceName: null,
  spaceId: null,
  muted: false,
  deafened: false,
  screenSharing: false,
  screenShareQuality: "high",
  liveParticipants: [],
  voicePresence: [],
  error: null,

  setScreenShareQuality: (screenShareQuality) => set({ screenShareQuality }),

  refreshPresence: async () => {
    const { channelId } = get();
    if (!channelId) return;
    const { data } = await supabase
      .from("voice_presence")
      .select("*, profile:profiles(*)")
      .eq("channel_id", channelId);
    set({ voicePresence: (data as VoicePresence[]) ?? [] });
  },

  subscribePresence: (channelId: string) => {
    if (presenceUnsub) {
      presenceUnsub();
      presenceUnsub = null;
    }
    void get().refreshPresence();
    const channel = supabase
      .channel(`voice-global:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "voice_presence",
          filter: `channel_id=eq.${channelId}`,
        },
        () => void get().refreshPresence(),
      )
      .subscribe();
    presenceUnsub = () => {
      supabase.removeChannel(channel);
    };
    return presenceUnsub;
  },

  join: async (channelId, channelName, spaceName, spaceId, profileId, displayName) => {
    if (!livekitUrl) {
      set({ error: "LiveKit not configured. Check VITE_LIVEKIT_URL in .env" });
      return;
    }

    const { connected, channelId: activeId } = get();
    if (connected && activeId && activeId !== channelId) {
      await get().leave();
    }

    profileIdRef = profileId;
    displayNameRef = displayName;

    try {
      set({ connecting: true, error: null, channelId, channelName, spaceName, spaceId });
      get().subscribePresence(channelId);

      const { data: session } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("livekit-token", {
        body: { channelId },
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });
      if (res.error) throw new Error(res.error.message);
      const { token } = res.data as { token: string };

      const { Room, RoomEvent } = await loadLiveKit();
      const room = new Room();
      roomRef.current = room;

      const onSync = () => syncParticipants(set);
      room.on(RoomEvent.ParticipantConnected, onSync);
      room.on(RoomEvent.ParticipantDisconnected, onSync);
      room.on(RoomEvent.TrackSubscribed, onSync);
      room.on(RoomEvent.TrackUnsubscribed, onSync);
      room.on(RoomEvent.LocalTrackPublished, onSync);
      room.on(RoomEvent.LocalTrackUnpublished, onSync);
      room.on(RoomEvent.ActiveSpeakersChanged, onSync);
      room.on(RoomEvent.Disconnected, () => {
        set({
          connected: false,
          screenSharing: false,
          liveParticipants: [],
          channelId: null,
          channelName: null,
          spaceName: null,
          spaceId: null,
        });
      });

      await room.connect(livekitUrl, token);
      await room.localParticipant.setMicrophoneEnabled(true);

      await supabase.from("voice_presence").upsert({
        channel_id: channelId,
        user_id: profileId,
        is_muted: false,
        is_deafened: false,
      });

      set({ connected: true, muted: false, deafened: false, connecting: false });
      syncParticipants(set);
    } catch (err) {
      roomRef.current?.disconnect();
      roomRef.current = null;
      set({
        connecting: false,
        error: err instanceof Error ? err.message : "Failed to join voice",
        channelId: null,
        channelName: null,
        spaceName: null,
        spaceId: null,
      });
    }
  },

  leave: async () => {
    const { channelId } = get();
    if (channelId && profileIdRef) {
      await supabase
        .from("voice_presence")
        .delete()
        .eq("channel_id", channelId)
        .eq("user_id", profileIdRef);
    }
    roomRef.current?.disconnect();
    roomRef.current = null;
    if (presenceUnsub) {
      presenceUnsub();
      presenceUnsub = null;
    }
    set({
      connected: false,
      connecting: false,
      screenSharing: false,
      liveParticipants: [],
      voicePresence: [],
      channelId: null,
      channelName: null,
      spaceName: null,
      spaceId: null,
      muted: false,
      deafened: false,
      error: null,
    });
  },

  toggleMute: async () => {
    const room = roomRef.current;
    const { muted, channelId } = get();
    if (!room || !channelId || !profileIdRef) return;
    const next = !muted;
    await room.localParticipant.setMicrophoneEnabled(!next);
    set({ muted: next });
    await supabase
      .from("voice_presence")
      .update({ is_muted: next })
      .eq("channel_id", channelId)
      .eq("user_id", profileIdRef);
    syncParticipants(set);
  },

  toggleDeafen: async () => {
    const room = roomRef.current;
    const { deafened, muted, channelId } = get();
    if (!room || !channelId || !profileIdRef) return;
    const next = !deafened;

    if (next) {
      preDeafenMutedRef.current = muted;
      room.remoteParticipants.forEach((p) => {
        p.audioTrackPublications.forEach((pub: RemoteTrackPublication) => pub.setEnabled(false));
      });
      if (!muted) {
        await room.localParticipant.setMicrophoneEnabled(false);
        set({ muted: true });
      }
    } else {
      room.remoteParticipants.forEach((p) => {
        p.audioTrackPublications.forEach((pub: RemoteTrackPublication) => pub.setEnabled(true));
      });
      const restoreMute = preDeafenMutedRef.current;
      await room.localParticipant.setMicrophoneEnabled(!restoreMute);
      set({ muted: restoreMute });
    }

    set({ deafened: next });
    await supabase
      .from("voice_presence")
      .update({ is_deafened: next, is_muted: next ? true : preDeafenMutedRef.current })
      .eq("channel_id", channelId)
      .eq("user_id", profileIdRef);
    syncParticipants(set);
  },

  toggleScreenShare: async () => {
    const room = roomRef.current;
    const { screenSharing, screenShareQuality } = get();
    if (!room) return;
    const next = !screenSharing;
    const quality = {
      standard: {
        resolution: { width: 1920, height: 1080, frameRate: 30 },
        encoding: { maxBitrate: 6_000_000, maxFramerate: 30 },
      },
      high: {
        resolution: { width: 2560, height: 1440, frameRate: 60 },
        encoding: { maxBitrate: 12_000_000, maxFramerate: 60 },
      },
      ultra: {
        resolution: { width: 3840, height: 2160, frameRate: 60 },
        encoding: { maxBitrate: 25_000_000, maxFramerate: 60 },
      },
    }[screenShareQuality];

    try {
      set({ error: null });
      await room.localParticipant.setScreenShareEnabled(
        next,
        next
          ? {
              audio: true,
              contentHint: "detail",
              resolution: quality.resolution,
              systemAudio: "include",
              surfaceSwitching: "include",
            }
          : undefined,
        next
          ? {
              screenShareEncoding: quality.encoding,
              simulcast: screenShareQuality !== "ultra",
            }
          : undefined,
      );
      set({ screenSharing: next });
      syncParticipants(set);
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Screen sharing failed. Check OS permissions.",
      });
    }
  },
}));
