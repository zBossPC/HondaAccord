import { useState } from "react";
import { Check, MessageCircle, UserPlus, X } from "lucide-react";
import { useFriends } from "../../hooks/useFriends";
import { useSpaces } from "../../hooks/useSpaces";
import { useAppStore } from "../../stores/appStore";
import { Avatar, StatusDot } from "../ui/Avatar";

export function FriendsPanel() {
  const {
    friends,
    pendingIncoming,
    pendingOutgoing,
    loading,
    sendRequest,
    acceptRequest,
    declineRequest,
    cancelRequest,
  } = useFriends();
  const { openDm, inviteFriend, spaces, getSpaceWithChannels } = useSpaces();
  const { selectSpace, selectChannel, setViewMode } = useAppStore();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tab, setTab] = useState<"online" | "all" | "pending">("online");

  async function handleAddFriend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await sendRequest(username.trim());
      setUsername("");
      setSuccess(`Friend request sent to ${username.trim()}`);
      setTab("pending");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  async function handleMessage(friendId: string) {
    try {
      const spaceId = await openDm(friendId);
      const { space, channels } = await getSpaceWithChannels(spaceId);
      setViewMode("home");
      selectSpace(space);
      const text = channels.find((c) => c.type === "text") ?? channels[0];
      if (text) selectChannel(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open DM");
    }
  }

  async function handleInvite(friendId: string, spaceId: string) {
    if (!spaceId) return;
    setError("");
    setSuccess("");
    try {
      await inviteFriend(spaceId, friendId);
      setSuccess("Friend invited to space!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite");
    }
  }

  const onlineFriends = friends.filter((f) => f.status === "online");
  const displayFriends = tab === "online" ? onlineFriends : friends;
  const pendingCount = pendingIncoming.length + pendingOutgoing.length;

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[var(--color-bg-tertiary)]">
      <div className="border-b border-[var(--color-border)] px-6 py-4">
        <h2 className="text-xl font-bold">Friends</h2>
        <div className="mt-3 flex gap-4 text-sm">
          {(
            [
              ["online", `Online — ${onlineFriends.length}`],
              ["all", `All — ${friends.length}`],
              ["pending", `Pending — ${pendingCount}`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`border-b-2 pb-1 font-medium transition-colors ${
                tab === key
                  ? "border-[var(--color-brand)] text-white"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <form onSubmit={handleAddFriend} className="mb-6 flex gap-2">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username"
            className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-input)] px-3 py-2 outline-none focus:border-[var(--color-brand)]"
          />
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[var(--color-brand)] px-4 py-2 font-medium hover:bg-[var(--color-brand-hover)]"
          >
            <UserPlus size={18} />
            Add
          </button>
        </form>

        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>
        )}
        {success && (
          <p className="mb-4 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-400">{success}</p>
        )}

        {loading ? (
          <p className="text-[var(--color-text-muted)]">Loading friends...</p>
        ) : tab === "pending" ? (
          <div className="space-y-6">
            {pendingIncoming.length > 0 && (
              <section>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-faint)]">
                  Incoming
                </h3>
                {pendingIncoming.map((req) => {
                  const name = req.requester?.display_name ?? req.requester?.username ?? "?";
                  return (
                    <FriendRow
                      key={req.id}
                      name={name}
                      subtitle="Incoming friend request"
                      avatarUrl={req.requester?.avatar_url}
                      actions={
                        <>
                          <ActionButton onClick={() => acceptRequest(req.id)} variant="accept">
                            <Check size={16} />
                          </ActionButton>
                          <ActionButton onClick={() => declineRequest(req.id)} variant="decline">
                            <X size={16} />
                          </ActionButton>
                        </>
                      }
                    />
                  );
                })}
              </section>
            )}
            {pendingOutgoing.length > 0 && (
              <section>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-[var(--color-text-faint)]">
                  Outgoing
                </h3>
                {pendingOutgoing.map((req) => {
                  const name = req.addressee?.display_name ?? req.addressee?.username ?? "?";
                  return (
                    <FriendRow
                      key={req.id}
                      name={name}
                      subtitle="Request sent"
                      avatarUrl={req.addressee?.avatar_url}
                      actions={
                        <button
                          type="button"
                          onClick={() => cancelRequest(req.id)}
                          className="text-xs text-[var(--color-text-muted)] hover:text-white"
                        >
                          Cancel
                        </button>
                      }
                    />
                  );
                })}
              </section>
            )}
            {pendingCount === 0 && (
              <p className="text-[var(--color-text-muted)]">No pending requests.</p>
            )}
          </div>
        ) : displayFriends.length === 0 ? (
          <p className="text-[var(--color-text-muted)]">
            {tab === "online" ? "No friends online right now." : "No friends yet — add someone by username!"}
          </p>
        ) : (
          displayFriends.map((friend) => {
            const name = friend.display_name ?? friend.username;
            return (
              <FriendRow
                key={friend.id}
                name={name}
                subtitle={friend.status}
                avatarUrl={friend.avatar_url}
                status={friend.status}
                actions={
                  <>
                    <ActionButton onClick={() => handleMessage(friend.id)} title="Message">
                      <MessageCircle size={16} />
                    </ActionButton>
                    {spaces.length > 0 && (
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleInvite(friend.id, e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-input)] px-2 py-1 text-xs"
                      >
                        <option value="">Invite to Space</option>
                        {spaces.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                    )}
                  </>
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}

function FriendRow({
  name,
  subtitle,
  avatarUrl,
  status,
  actions,
}: {
  name: string;
  subtitle: string;
  avatarUrl?: string | null;
  status?: "online" | "idle" | "dnd" | "offline";
  actions: React.ReactNode;
}) {
  return (
    <div className="mb-1 flex items-center justify-between rounded-lg px-2 py-2 hover:bg-[var(--color-bg-hover)]">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar name={name} avatarUrl={avatarUrl} size="md" />
          {status && (
            <span className="absolute -bottom-0.5 -right-0.5">
              <StatusDot status={status} />
            </span>
          )}
        </div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-xs capitalize text-[var(--color-text-muted)]">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  title,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title?: string;
  variant?: "accept" | "decline";
}) {
  const styles = {
    accept: "bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white",
    decline: "bg-[var(--color-bg-accent)] text-[var(--color-text-muted)] hover:bg-red-500/20 hover:text-red-400",
  };
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-full p-2 transition-colors ${
        variant ? styles[variant] : "bg-[var(--color-bg-accent)] text-[var(--color-text-muted)] hover:bg-[var(--color-brand)] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
