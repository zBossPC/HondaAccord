import { useEffect, useState } from "react";
import { useAuth, usePresence } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/authStore";
import { useAppStore } from "../../stores/appStore";
import { useSpaces } from "../../hooks/useSpaces";
import { SpaceList } from "./SpaceList";
import { ChannelList } from "./ChannelList";
import { DmList } from "./DmList";
import { ChatArea } from "../chat/ChatArea";
import { VoicePanel } from "../voice/VoicePanel";
import { FriendsPanel } from "../friends/FriendsPanel";
import { UserPanel } from "../ui/UserPanel";
import { WelcomePane } from "./WelcomePane";
import { SettingsModal } from "../settings/SettingsModal";

export function MainLayout() {
  const { profile } = useAuthStore();
  const { signOut } = useAuth();
  const { viewMode, selectedSpace, selectedChannel } = useAppStore();
  const { channels, loadChannels } = useSpaces();
  const [showSettings, setShowSettings] = useState(false);

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

      <div className="flex min-w-0 flex-1 overflow-hidden">
        {viewMode === "friends" ? (
          <>
            <div className="flex h-full min-h-0 w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              <div className="flex h-12 shrink-0 items-center border-b border-[var(--color-border)] px-4">
                <h2 className="font-semibold">Friends</h2>
              </div>
              <div className="flex-1 px-3 py-4 text-sm text-[var(--color-text-muted)]">
                Add friends by username, accept requests, and start DMs.
              </div>
              <UserPanel
                onOpenSettings={() => setShowSettings(true)}
                onSignOut={signOut}
              />
            </div>
            <FriendsPanel />
          </>
        ) : viewMode === "home" ? (
          <>
            <div className="flex h-full min-h-0 shrink-0 flex-col">
              <DmList />
              <div className="w-60">
                <UserPanel
                  onOpenSettings={() => setShowSettings(true)}
                  onSignOut={signOut}
                />
              </div>
            </div>
            {selectedSpace && selectedChannel ? (
              selectedChannel.type === "text" ? (
                <ChatArea
                  channelId={selectedChannel.id}
                  channelName={selectedSpace.name}
                  isDm
                />
              ) : (
                <VoicePanel channelId={selectedChannel.id} channelName={selectedChannel.name} />
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
              />
              <div className="w-60">
                <UserPanel
                  onOpenSettings={() => setShowSettings(true)}
                  onSignOut={signOut}
                />
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
              />
            ) : (
              <WelcomePane spaceName={selectedSpace.name} />
            )}
          </>
        ) : (
          <WelcomePane />
        )}
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
