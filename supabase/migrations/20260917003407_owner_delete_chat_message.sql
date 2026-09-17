create or replace function public.owner_delete_chat_message(p_message_id bigint)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'Authentication required.'; end if;

  delete from public.chat_messages cm using public.item i
  where cm.id = p_message_id
    and cm.item_id = i.id
    and i.owner_id = auth.uid()
    and cm.sender_role = 'owner'
    and cm.sender_user_id = auth.uid();

  if not found then raise exception 'Message not found or access denied.'; end if;
end;
$$;

revoke all on function public.owner_delete_chat_message(bigint) from public, anon;
grant execute on function public.owner_delete_chat_message(bigint) to authenticated;
