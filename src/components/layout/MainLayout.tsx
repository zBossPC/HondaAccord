import { useEffect, useState } from "react";
import { useAuth, usePresence } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/authStore";
import { useAppStore } from "../../stores/appStore";
import { useSpaces } from "../../hooks/useSpaces";
import { useVoiceStore } from "../../stores/voiceStore";
import { SpaceList } from "./SpaceList";
import { ChannelList } from "./ChannelList";
import { DmList } from "./DmList";
import { ChatArea } from "../chat/ChatArea";
import { VoicePanel } from "../voice/VoicePanel";
import { VoiceBar } from "../voice/VoiceBar";
import { FriendsPanel } from "../friends/FriendsPanel";
import { UserPanel } from "../ui/UserPanel";
import { WelcomePane } from "./WelcomePane";
import { SettingsModal } from "../settings/SettingsModal";
import { SpaceSettingsModal } from "../settings/SpaceSettingsModal";

export function MainLayout() {
  const { profile } = useAuthStore();
  const { signOut } = useAuth();
  const { viewMode, selectedSpace, selectedChannel } = useAppStore();
  const { channels, loadChannels } = useSpaces();
  const connected = useVoiceStore((s) => s.connected);
  const [showSettings, setShowSettings] = useState(false);
  const [showSpaceSettings, setShowSpaceSettings] = useState(false);

  usePresence(profile?.id, profile?.status);

  useEffect(() => {
    if (selectedSpace && viewMode !== "friends") {
      loadChannels(selectedSpace.id);
    }
  }, [selectedSpace, viewMode, loadChannels]);

  const isDm = selectedSpace?.type === "dm";

  return (
    <div className="flex h-full min-h-0 w-full flex-1 overflow-hidden">
      <SpaceList />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {viewMode === "friends" ? (
            <>
              <div className="flex h-full min-h-0 w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <div className="flex h-12 shrink-0 items-center border-b border-[var(--color-border)] px-4">
                  <h2 className="font-semibold">Friends</h2>
                </div>
                <div className="flex-1 px-3 py-4 text-sm text-[var(--color-text-muted)]">
                  Add friends by username, accept requests, and start DMs.
                </div>
                <UserPanel onOpenSettings={() => setShowSettings(true)} onSignOut={signOut} />
              </div>
              <FriendsPanel />
            </>
          ) : viewMode === "home" ? (
            <>
              <div className="flex h-full min-h-0 shrink-0 flex-col">
                <DmList />
                <div className="w-60">
                  <UserPanel onOpenSettings={() => setShowSettings(true)} onSignOut={signOut} />
                </div>
              </div>
              {selectedSpace && selectedChannel ? (
                selectedChannel.type === "text" ? (
                  <ChatArea channelId={selectedChannel.id} channelName={selectedSpace.name} isDm />
                ) : (
                  <VoicePanel
                    channelId={selectedChannel.id}
                    channelName={selectedChannel.name}
                    spaceName={selectedSpace.name}
                    spaceId={selectedSpace.id}
                  />
                )
              ) : (
                <WelcomePane />
              )}
            </>
          ) : selectedSpace ? (
            <>
              <div className="flex h-full min-h-0 shrink-0 flex-col">
                <ChannelList
                  channels={channels}
                  spaceName={selectedSpace.name}
                  isDm={isDm}
                  onOpenSpaceSettings={() => setShowSpaceSettings(true)}
                />
                <div className="w-60">
                  <UserPanel onOpenSettings={() => setShowSettings(true)} onSignOut={signOut} />
                </div>
              </div>
              {selectedChannel?.type === "text" ? (
                <ChatArea
                  channelId={selectedChannel.id}
                  channelName={selectedChannel.name}
                  isDm={isDm}
                />
              ) : selectedChannel?.type === "voice" ? (
                <VoicePanel
                  channelId={selectedChannel.id}
                  channelName={selectedChannel.name}
                  spaceName={selectedSpace.name}
                  spaceId={selectedSpace.id}
                />
              ) : (
                <WelcomePane spaceName={selectedSpace.name} />
              )}
            </>
          ) : (
            <WelcomePane />
          )}
        </div>

        {connected && <VoiceBar />}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showSpaceSettings && selectedSpace && selectedSpace.type === "space" && (
        <SpaceSettingsModal
          spaceId={selectedSpace.id}
          spaceName={selectedSpace.name}
          isOwner={selectedSpace.owner_id === profile?.id}
          onClose={() => setShowSpaceSettings(false)}
        />
      )}
    </div>
  );
}
