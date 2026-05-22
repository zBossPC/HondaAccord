import { useCallback, useEffect, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  Track,
  type RemoteParticipant,
  type RemoteTrackPublication,
} from "livekit-client";
import { livekitUrl, supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/authStore";
import type { VoicePresence } from "../types";

interface LiveParticipant {
  identity: string;
  name: string;
  isSpeaking: boolean;
  isMuted: boolean;
  videoTrack?: MediaStreamTrack | null;
}

export function useVoice(channelId: string | undefined) {
  const { profile } = useAuthStore();
  const roomRef = useRef<Room | null>(null);
  const preDeafenMutedRef = useRef(false);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [muted, setMuted] = useState(false);
  const [deafened, setDeafened] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenShareQuality, setScreenShareQuality] =
    useState<"standard" | "high" | "ultra">("high");
  const [liveParticipants, setLiveParticipants] = useState<LiveParticipant[]>([]);
  const [voicePresence, setVoicePresence] = useState<VoicePresence[]>([]);
  const [error, setError] = useState<string | null>(null);

  const syncParticipants = useCallback(() => {
    const room = roomRef.current;
    if (!room) return;

    const list: LiveParticipant[] = [];

    const addParticipant = (identity: string, name: string, isLocal: boolean) => {
      const p = isLocal ? room.localParticipant : room.remoteParticipants.get(identity);
      if (!p) return;

      let videoTrack: MediaStreamTrack | null = null;
      p.videoTrackPublications.forEach((pub) => {
        if (pub.track && pub.source === Track.Source.ScreenShare) {
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

    addParticipant(room.localParticipant.identity, profile?.display_name ?? profile?.username ?? "You", true);
    room.remoteParticipants.forEach((p: RemoteParticipant) => {
      addParticipant(p.identity, p.name ?? p.identity, false);
    });

    setLiveParticipants(list);
  }, [profile]);

  const loadPresence = useCallback(async () => {
    if (!channelId) return;
    const { data } = await supabase
      .from("voice_presence")
      .select("*, profile:profiles(*)")
      .eq("channel_id", channelId);
    setVoicePresence((data as VoicePresence[]) ?? []);
  }, [channelId]);

  useEffect(() => {
    loadPresence();
    if (!channelId) return;

    const channel = supabase
      .channel(`voice:${channelId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "voice_presence", filter: `channel_id=eq.${channelId}` },
        () => loadPresence(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, loadPresence]);

  async function join() {
    if (!channelId || !profile || !livekitUrl) {
      setError("LiveKit not configured. Check VITE_LIVEKIT_URL in .env");
      return;
    }

    try {
      setConnecting(true);
      setError(null);
      const { data: session } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("livekit-token", {
        body: { channelId },
        headers: { Authorization: `Bearer ${session.session?.access_token}` },
      });

      if (res.error) throw new Error(res.error.message);
      const { token } = res.data as { token: string };

      const room = new Room();
      roomRef.current = room;

      room.on(RoomEvent.ParticipantConnected, syncParticipants);
      room.on(RoomEvent.ParticipantDisconnected, syncParticipants);
      room.on(RoomEvent.TrackSubscribed, syncParticipants);
      room.on(RoomEvent.TrackUnsubscribed, syncParticipants);
      room.on(RoomEvent.LocalTrackPublished, syncParticipants);
      room.on(RoomEvent.LocalTrackUnpublished, syncParticipants);
      room.on(RoomEvent.ActiveSpeakersChanged, syncParticipants);
      room.on(RoomEvent.Disconnected, () => {
        setConnected(false);
        setScreenSharing(false);
        setLiveParticipants([]);
      });

      await room.connect(livekitUrl, token);
      await room.localParticipant.setMicrophoneEnabled(true);

      await supabase.from("voice_presence").upsert({
        channel_id: channelId,
        user_id: profile.id,
        is_muted: false,
        is_deafened: false,
      });

      setConnected(true);
      syncParticipants();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join voice");
    } finally {
      setConnecting(false);
    }
  }

  async function leave() {
    if (channelId && profile) {
      await supabase
        .from("voice_presence")
        .delete()
        .eq("channel_id", channelId)
        .eq("user_id", profile.id);
    }
    roomRef.current?.disconnect();
    roomRef.current = null;
    setConnected(false);
    setScreenSharing(false);
    setLiveParticipants([]);
  }

  async function toggleMute() {
    const room = roomRef.current;
    if (!room || !profile || !channelId) return;
    const next = !muted;
    await room.localParticipant.setMicrophoneEnabled(!next);
    setMuted(next);
    await supabase
      .from("voice_presence")
      .update({ is_muted: next })
      .eq("channel_id", channelId)
      .eq("user_id", profile.id);
    syncParticipants();
  }

  async function toggleDeafen() {
    const room = roomRef.current;
    if (!room || !profile || !channelId) return;
    const next = !deafened;

    if (next) {
      preDeafenMutedRef.current = muted;
      room.remoteParticipants.forEach((p) => {
        p.audioTrackPublications.forEach((pub: RemoteTrackPublication) => pub.setEnabled(false));
      });
      if (!muted) {
        await room.localParticipant.setMicrophoneEnabled(false);
        setMuted(true);
      }
    } else {
      room.remoteParticipants.forEach((p) => {
        p.audioTrackPublications.forEach((pub: RemoteTrackPublication) => pub.setEnabled(true));
      });
      const restoreMute = preDeafenMutedRef.current;
      await room.localParticipant.setMicrophoneEnabled(!restoreMute);
      setMuted(restoreMute);
    }

    setDeafened(next);
    await supabase
      .from("voice_presence")
      .update({ is_deafened: next, is_muted: next ? true : preDeafenMutedRef.current })
      .eq("channel_id", channelId)
      .eq("user_id", profile.id);
    syncParticipants();
  }

  async function toggleScreenShare() {
    const room = roomRef.current;
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
      setError(null);
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
      setScreenSharing(next);
      syncParticipants();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Screen sharing failed. Check OS permissions and try again.",
      );
    }
  }

  useEffect(() => {
    return () => {
      leave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId]);

  return {
    connected,
    connecting,
    muted,
    deafened,
    screenSharing,
    screenShareQuality,
    setScreenShareQuality,
    liveParticipants,
    voicePresence,
    error,
    join,
    leave,
    toggleMute,
    toggleDeafen,
    toggleScreenShare,
  };
}
