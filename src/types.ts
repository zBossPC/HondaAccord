export type UserStatus = "online" | "idle" | "dnd" | "offline";
export type FriendshipStatus = "pending" | "accepted" | "blocked";
export type SpaceType = "space" | "dm";
export type ChannelType = "text" | "voice";
export type MemberRole = "owner" | "admin" | "member";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  status: UserStatus;
  status_message: string | null;
  created_at: string;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: FriendshipStatus;
  created_at: string;
  requester?: Profile;
  addressee?: Profile;
}

export interface Space {
  id: string;
  name: string;
  icon_url: string | null;
  owner_id: string;
  type: SpaceType;
  created_at: string;
}

export interface SpaceMember {
  space_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
  profile?: Profile;
}

export interface Channel {
  id: string;
  space_id: string;
  name: string;
  type: ChannelType;
  position: number;
  created_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  author_id: string;
  content: string;
  reply_to_id: string | null;
  edited_at: string | null;
  created_at: string;
  author?: Profile;
}

export interface VoicePresence {
  channel_id: string;
  user_id: string;
  joined_at: string;
  is_muted: boolean;
  is_deafened: boolean;
  profile?: Profile;
}
