import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../stores/authStore";
import type { Channel, Space } from "../types";

export function useSpaces() {
  const { profile } = useAuthStore();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [dmSpaces, setDmSpaces] = useState<Space[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSpaces = useCallback(async () => {
    if (!profile) return;
    setLoading(true);

    const { data: memberships } = await supabase
      .from("space_members")
      .select("space_id")
      .eq("user_id", profile.id);

    if (!memberships?.length) {
      setSpaces([]);
      setDmSpaces([]);
      setLoading(false);
      return;
    }

    const spaceIds = memberships.map((m) => m.space_id);
    const { data } = await supabase
      .from("spaces")
      .select("*")
      .in("id", spaceIds)
      .order("created_at");

    const all = (data as Space[]) ?? [];
    setSpaces(all.filter((s) => s.type === "space"));
    setDmSpaces(all.filter((s) => s.type === "dm"));
    setLoading(false);
  }, [profile]);

  const loadChannels = useCallback(async (spaceId: string) => {
    const { data } = await supabase
      .from("channels")
      .select("*")
      .eq("space_id", spaceId)
      .order("position");
    setChannels((data as Channel[]) ?? []);
    return (data as Channel[]) ?? [];
  }, []);

  useEffect(() => {
    loadSpaces();
  }, [loadSpaces]);

  async function createSpace(name: string) {
    const { data, error } = await supabase.rpc("create_space", { p_name: name });
    if (error) throw error;
    await loadSpaces();
    return data as string;
  }

  async function inviteFriend(spaceId: string, friendId: string) {
    const { error } = await supabase.rpc("invite_friend_to_space", {
      p_space_id: spaceId,
      p_friend_id: friendId,
    });
    if (error) throw error;
  }

  async function openDm(friendId: string) {
    const { data, error } = await supabase.rpc("get_or_create_dm", {
      p_friend_id: friendId,
    });
    if (error) throw error;
    await loadSpaces();
    return data as string;
  }

  async function getSpaceWithChannels(spaceId: string) {
    const { data: space } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", spaceId)
      .single();
    const ch = await loadChannels(spaceId);
    return { space: space as Space, channels: ch };
  }

  return {
    spaces,
    dmSpaces,
    channels,
    loading,
    loadChannels,
    createSpace,
    inviteFriend,
    openDm,
    getSpaceWithChannels,
    reloadSpaces: loadSpaces,
  };
}
