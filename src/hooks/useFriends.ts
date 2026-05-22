import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/authStore";
import type { Friendship, Profile } from "../types";

export function useFriends() {
  const { profile } = useAuthStore();
  const [friends, setFriends] = useState<Profile[]>([]);
  const [pendingIncoming, setPendingIncoming] = useState<Friendship[]>([]);
  const [pendingOutgoing, setPendingOutgoing] = useState<Friendship[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!profile) return;
    setLoading(true);

    const { data: friendships } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${profile.id},addressee_id.eq.${profile.id}`);

    if (!friendships) {
      setLoading(false);
      return;
    }

    const userIds = new Set<string>();
    for (const f of friendships) {
      userIds.add(f.requester_id);
      userIds.add(f.addressee_id);
    }
    userIds.delete(profile.id);

    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", [...userIds]);

    const profileMap = new Map(
      (profiles ?? []).map((p) => [p.id, p as Profile]),
    );

    const accepted: Profile[] = [];
    const incoming: Friendship[] = [];
    const outgoing: Friendship[] = [];

    for (const f of friendships) {
      if (f.status === "accepted") {
        const friendId =
          f.requester_id === profile.id ? f.addressee_id : f.requester_id;
        const friend = profileMap.get(friendId);
        if (friend) accepted.push(friend);
      } else if (f.status === "pending") {
        if (f.addressee_id === profile.id) {
          incoming.push({
            ...f,
            requester: profileMap.get(f.requester_id),
          } as Friendship);
        } else {
          outgoing.push({
            ...f,
            addressee: profileMap.get(f.addressee_id),
          } as Friendship);
        }
      }
    }

    setFriends(accepted);
    setPendingIncoming(incoming);
    setPendingOutgoing(outgoing);
    setLoading(false);
  }, [profile]);

  useEffect(() => {
    load();

    if (!profile) return;

    const channel = supabase
      .channel("friends-presence")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles" },
        (payload) => {
          const updated = payload.new as Profile;
          setFriends((prev) =>
            prev.map((f) => (f.id === updated.id ? { ...f, ...updated } : f)),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friendships" },
        () => load(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, profile]);

  async function sendRequest(username: string) {
    const { data: target } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (!target) throw new Error("User not found");
    if (target.id === profile?.id) throw new Error("Cannot add yourself");

    const { data: existing } = await supabase
      .from("friendships")
      .select("id, status")
      .or(
        `and(requester_id.eq.${profile!.id},addressee_id.eq.${target.id}),and(requester_id.eq.${target.id},addressee_id.eq.${profile!.id})`,
      )
      .maybeSingle();

    if (existing) {
      if (existing.status === "accepted") throw new Error("Already friends");
      if (existing.status === "pending") throw new Error("Request already pending");
    }

    const { error } = await supabase.from("friendships").insert({
      requester_id: profile!.id,
      addressee_id: target.id,
      status: "pending",
    });
    if (error) throw error;
    await load();
  }

  async function acceptRequest(friendshipId: string) {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId);
    if (error) throw error;
    await load();
  }

  async function declineRequest(friendshipId: string) {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);
    if (error) throw error;
    await load();
  }

  async function cancelRequest(friendshipId: string) {
    await declineRequest(friendshipId);
  }

  return {
    friends,
    pendingIncoming,
    pendingOutgoing,
    loading,
    sendRequest,
    acceptRequest,
    declineRequest,
    cancelRequest,
    reload: load,
  };
}
