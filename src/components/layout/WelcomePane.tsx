import { MessageCircle, Plus, Sparkles, UserPlus, Users } from "lucide-react";
import { useAppStore } from "../../stores/appStore";

export function WelcomePane({ spaceName }: { spaceName?: string }) {
  const { openFriends, openHome } = useAppStore();

  if (spaceName) {
    return (
      <div className="welcome-pane">
        <div className="welcome-card">
          <h2>Welcome to {spaceName}</h2>
          <p>Pick a channel from the sidebar to chat or join voice.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-pane">
      <div className="welcome-hero">
        <img src="icon.png" alt="" className="app-logo welcome-logo" />
        <div className="welcome-badge">
          <Sparkles size={14} />
          Ready when you are
        </div>
        <h2>Welcome to HondaAccord</h2>
        <p>
          Private spaces, voice channels, and DMs — built for friend groups, not public servers.
        </p>
      </div>

      <div className="welcome-actions">
        <button type="button" onClick={openFriends} className="welcome-action welcome-action-primary">
          <UserPlus size={20} />
          <span>
            <strong>Add Friends</strong>
            <small>Find people by username</small>
          </span>
        </button>
        <button type="button" onClick={openHome} className="welcome-action">
          <MessageCircle size={20} />
          <span>
            <strong>Direct Messages</strong>
            <small>Jump into 1:1 chats</small>
          </span>
        </button>
      </div>

      <p className="welcome-tip">
        Use <Users size={14} className="inline-icon" /> for Friends or <Plus size={14} className="inline-icon" /> to
        create a Space.
      </p>
    </div>
  );
}
