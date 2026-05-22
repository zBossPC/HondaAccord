-- Allow users to delete/decline friendships they're part of
create policy "Users can delete own friendships"
  on public.friendships for delete to authenticated
  using (auth.uid() = requester_id or auth.uid() = addressee_id);
