-- Allow owners to delete spaces and add leave/delete RPCs

create policy "Owners can delete spaces"
  on public.spaces for delete to authenticated
  using (auth.uid() = owner_id);

create or replace function public.delete_space(p_space_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not exists (
    select 1 from public.spaces
    where id = p_space_id and owner_id = auth.uid()
  ) then
    raise exception 'Only the space owner can delete this space';
  end if;

  delete from public.spaces where id = p_space_id;
end;
$$;

create or replace function public.leave_space(p_space_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_role text;
begin
  select role into v_role
  from public.space_members
  where space_id = p_space_id and user_id = auth.uid();

  if v_role is null then
    raise exception 'You are not a member of this space';
  end if;

  if v_role = 'owner' then
    raise exception 'Owners must delete the space instead of leaving';
  end if;

  delete from public.space_members
  where space_id = p_space_id and user_id = auth.uid();
end;
$$;

grant execute on function public.delete_space(uuid) to authenticated;
grant execute on function public.leave_space(uuid) to authenticated;
