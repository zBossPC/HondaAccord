import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Hash, Send, Smile } from "lucide-react";
import { useMessages } from "../../hooks/useMessages";
import { useAuthStore } from "../../stores/authStore";
import { Avatar } from "../ui/Avatar";

interface ChatAreaProps {
  channelId: string;
  channelName: string;
  isDm?: boolean;
}

export function ChatArea({ channelId, channelName, isDm }: ChatAreaProps) {
  const { profile } = useAuthStore();
  const { messages, loading, sendMessage } = useMessages(channelId);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !input.trim()) return;
    setSending(true);
    setError("");
    try {
      await sendMessage(input, profile.id);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  const placeholder = isDm
    ? `Message @${channelName}`
    : `Message #${channelName}`;

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[var(--color-bg-tertiary)]">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--color-border)] px-4 shadow-sm">
        {isDm ? (
          <span className="font-semibold">@{channelName}</span>
        ) : (
          <>
            <Hash size={20} className="text-[var(--color-text-muted)]" />
            <span className="font-semibold">{channelName}</span>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="text-center text-sm text-[var(--color-text-muted)]">Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-bg-elevated)]">
              {isDm ? <Smile size={28} className="text-[var(--color-text-muted)]" /> : <Hash size={28} className="text-[var(--color-text-muted)]" />}
            </div>
            <h3 className="text-lg font-bold">
              {isDm ? `Say hi to ${channelName}!` : `Welcome to #${channelName}`}
            </h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              This is the start of your conversation.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const authorName = msg.author?.display_name ?? msg.author?.username ?? "Unknown";
            const prev = messages[i - 1];
            const sameAuthor =
              prev &&
              prev.author_id === msg.author_id &&
              new Date(msg.created_at).getTime() - new Date(prev.created_at).getTime() < 300000;

            return (
              <div
                key={msg.id}
                className={`group flex gap-3 ${sameAuthor ? "mt-0.5" : "mt-4"}`}
              >
                {sameAuthor ? (
                  <div className="w-10 shrink-0" />
                ) : (
                  <Avatar
                    name={authorName}
                    avatarUrl={msg.author?.avatar_url}
                    size="md"
                    className="shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  {!sameAuthor && (
                    <div className="mb-0.5 flex items-baseline gap-2">
                      <span className="font-semibold hover:underline">{authorName}</span>
                      <span className="text-xs text-[var(--color-text-faint)]">
                        {new Date(msg.created_at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                  <div className="prose prose-invert max-w-none break-words text-[15px] leading-relaxed text-[var(--color-text-primary)]">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 px-4 pb-6">
        {error && (
          <p className="mb-2 text-sm text-red-400">{error}</p>
        )}
        <form onSubmit={handleSend}>
          <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 transition focus-within:border-[var(--color-brand)]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent py-3 outline-none placeholder:text-[var(--color-text-faint)]"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-md p-1.5 text-[var(--color-text-muted)] transition hover:bg-[var(--color-brand)] hover:text-white disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
