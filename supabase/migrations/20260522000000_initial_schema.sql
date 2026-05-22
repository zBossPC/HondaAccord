-- HondaAccord initial schema

create extension if not exists "pgcrypto";

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  status text not null default 'offline' check (status in ('online', 'idle', 'dnd', 'offline')),
  status_message text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select to authenticated using (true);

create policy "Users can update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Friendships
create table public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  unique (requester_id, addressee_id),
  check (requester_id <> addressee_id)
);

alter table public.friendships enable row level security;

create policy "Users can view own friendships"
  on public.friendships for select to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

create policy "Users can send friend requests"
  on public.friendships for insert to authenticated
  with check (auth.uid() = requester_id and status = 'pending');

create policy "Users can update friendships they're part of"
  on public.friendships for update to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Spaces
create table public.spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon_url text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  type text not null default 'space' check (type in ('space', 'dm')),
  created_at timestamptz not null default now()
);

alter table public.spaces enable row level security;

-- Space members (before is_space_member function)
create table public.space_members (
  space_id uuid not null references public.spaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  joined_at timestamptz not null default now(),
  primary key (space_id, user_id)
);

alter table public.space_members enable row level security;

create or replace function public.is_space_member(p_space_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select exists (
    select 1 from public.space_members
    where space_id = p_space_id and user_id = p_user_id
  );
$$;

create policy "Members can view their spaces"
  on public.spaces for select to authenticated
  using (public.is_space_member(id, auth.uid()));

create policy "Users can create spaces"
  on public.spaces for insert to authenticated
  with check (auth.uid() = owner_id);

create policy "Owners can update spaces"
  on public.spaces for update to authenticated
  using (auth.uid() = owner_id);

create policy "Members can view space membership"
  on public.space_members for select to authenticated
  using (public.is_space_member(space_id, auth.uid()));

create policy "Owners/admins can add members"
  on public.space_members for insert to authenticated
  with check (
    exists (
      select 1 from public.space_members sm
      where sm.space_id = space_members.space_id
        and sm.user_id = auth.uid()
        and sm.role in ('owner', 'admin')
    )
    or auth.uid() = user_id
  );

create policy "Users can leave spaces"
  on public.space_members for delete to authenticated
  using (auth.uid() = user_id or exists (
    select 1 from public.space_members sm
    where sm.space_id = space_members.space_id
      and sm.user_id = auth.uid()
      and sm.role = 'owner'
  ));

-- Channels
create table public.channels (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references public.spaces(id) on delete cascade,
  name text not null,
  type text not null check (type in ('text', 'voice')),
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.channels enable row level security;

create policy "Members can view channels"
  on public.channels for select to authenticated
  using (public.is_space_member(space_id, auth.uid()));

create policy "Owners/admins can manage channels"
  on public.channels for insert to authenticated
  with check (exists (
    select 1 from public.space_members sm
    where sm.space_id = channels.space_id
      and sm.user_id = auth.uid()
      and sm.role in ('owner', 'admin')
  ));

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  reply_to_id uuid references public.messages(id) on delete set null,
  edited_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create or replace function public.get_channel_space_id(p_channel_id uuid)
returns uuid
language sql
stable
security definer set search_path = public
as $$
  select space_id from public.channels where id = p_channel_id;
$$;

create policy "Members can read messages"
  on public.messages for select to authenticated
  using (public.is_space_member(public.get_channel_space_id(channel_id), auth.uid()));

create policy "Members can send messages"
  on public.messages for insert to authenticated
  with check (
    auth.uid() = author_id
    and public.is_space_member(public.get_channel_space_id(channel_id), auth.uid())
  );

create policy "Authors can update own messages"
  on public.messages for update to authenticated
  using (auth.uid() = author_id);

create policy "Authors can delete own messages"
  on public.messages for delete to authenticated
  using (auth.uid() = author_id);

-- Voice presence
create table public.voice_presence (
  channel_id uuid not null references public.channels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  is_muted boolean not null default false,
  is_deafened boolean not null default false,
  primary key (channel_id, user_id)
);

alter table public.voice_presence enable row level security;

create policy "Members can view voice presence"
  on public.voice_presence for select to authenticated
  using (public.is_space_member(public.get_channel_space_id(channel_id), auth.uid()));

create policy "Users can join voice"
  on public.voice_presence for insert to authenticated
  with check (
    auth.uid() = user_id
    and public.is_space_member(public.get_channel_space_id(channel_id), auth.uid())
  );

create policy "Users can update own voice state"
  on public.voice_presence for update to authenticated
  using (auth.uid() = user_id);

create policy "Users can leave voice"
  on public.voice_presence for delete to authenticated
  using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.voice_presence;

-- RPC: create space with default channels
create or replace function public.create_space(p_name text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_space_id uuid;
begin
  insert into public.spaces (name, owner_id)
  values (p_name, auth.uid())
  returning id into v_space_id;

  insert into public.space_members (space_id, user_id, role)
  values (v_space_id, auth.uid(), 'owner');

  insert into public.channels (space_id, name, type, position) values
    (v_space_id, 'general', 'text', 0),
    (v_space_id, 'Voice', 'voice', 1);

  return v_space_id;
end;
$$;

grant execute on function public.create_space(text) to authenticated;

-- RPC: get or create DM space between two users
create or replace function public.get_or_create_dm(p_friend_id uuid)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_space_id uuid;
  v_name text;
begin
  select s.id into v_space_id
  from public.spaces s
  join public.space_members sm1 on sm1.space_id = s.id and sm1.user_id = auth.uid()
  join public.space_members sm2 on sm2.space_id = s.id and sm2.user_id = p_friend_id
  where s.type = 'dm'
  limit 1;

  if v_space_id is not null then
    return v_space_id;
  end if;

  select coalesce(display_name, username) into v_name
  from public.profiles where id = p_friend_id;

  insert into public.spaces (name, owner_id, type)
  values (v_name, auth.uid(), 'dm')
  returning id into v_space_id;

  insert into public.space_members (space_id, user_id, role) values
    (v_space_id, auth.uid(), 'member'),
    (v_space_id, p_friend_id, 'member');

  insert into public.channels (space_id, name, type, position)
  values (v_space_id, 'messages', 'text', 0);

  return v_space_id;
end;
$$;

grant execute on function public.get_or_create_dm(uuid) to authenticated;

-- RPC: add friend to space
create or replace function public.invite_friend_to_space(p_space_id uuid, p_friend_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.friendships
    where status = 'accepted'
      and ((requester_id = auth.uid() and addressee_id = p_friend_id)
        or (requester_id = p_friend_id and addressee_id = auth.uid()))
  ) then
    raise exception 'Not friends with this user';
  end if;

  if not exists (
    select 1 from public.space_members
    where space_id = p_space_id and user_id = auth.uid()
      and role in ('owner', 'admin')
  ) then
    raise exception 'Not authorized';
  end if;

  insert into public.space_members (space_id, user_id, role)
  values (p_space_id, p_friend_id, 'member')
  on conflict do nothing;
end;
$$;

grant execute on function public.invite_friend_to_space(uuid, uuid) to authenticated;
