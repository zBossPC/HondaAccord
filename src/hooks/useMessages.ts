import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Message } from "../types";

export function useMessages(channelId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!channelId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*, author:profiles(*)")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true })
      .limit(200);

    setMessages((data as Message[]) ?? []);
    setLoading(false);
  }, [channelId]);

  useEffect(() => {
    load();

    if (!channelId) return;

    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${channelId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from("messages")
            .select("*, author:profiles(*)")
            .eq("id", payload.new.id)
            .single();
          if (data) {
            setMessages((prev) => [...prev, data as Message]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelId, load]);

  async function sendMessage(content: string, authorId: string) {
    if (!channelId || !content.trim()) return;
    const { error } = await supabase.from("messages").insert({
      channel_id: channelId,
      author_id: authorId,
      content: content.trim(),
    });
    if (error) throw error;
  }

  return { messages, loading, sendMessage, reload: load };
}
