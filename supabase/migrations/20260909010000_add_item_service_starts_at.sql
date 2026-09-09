alter table public.item
  add column if not exists service_starts_at timestamptz;

create or replace function private.confirm_service_activation() returns trigger language plpgsql security definer set search_path = '' as $$
declare v_item public.item%rowtype; v_start timestamptz; v_end timestamptz; v_period_label text;
begin
  if new.status = 'confirmed' and old.status is distinct from 'confirmed' then
    select * into v_item from public.item where id = new.item_id;
    if not found then raise exception 'Profile not found'; end if;
    v_start := greatest(now(), coalesce(v_item.trial_ends_at, now()));
    v_end := v_start + make_interval(months => new.period_months);
    v_period_label := case new.period_months when 12 then '1-წლიანი' else new.period_months::text || '-თვიანი' end;
    new.confirmed_at := now(); new.service_starts_at := v_start; new.service_expires_at := v_end;
    update public.item set service_status = 'active', service_starts_at = v_start, service_expires_at = v_end where id = new.item_id and owner_id = new.owner_id;
    insert into public.notifications(user_id,type,title,message,metadata) values (new.owner_id,'service','მომსახურება გააქტიურდა',coalesce(v_item.item_name,'QR პროფილი') || '-ის ' || v_period_label || ' მომსახურება გააქტიურდა და მოქმედებს ' || to_char(v_end at time zone 'Asia/Tbilisi','DD.MM.YYYY HH24:MI') || '-მდე.',jsonb_build_object('request_id',new.id,'item_id',new.item_id,'tag_code',v_item.tag_code,'status','confirmed','starts_at',v_start,'expires_at',v_end));
    insert into public.live_chat_messages(profile_type,tag_code,sender_type,sender_session,message) values (coalesce(nullif(v_item.item_type,''),'item'),v_item.tag_code,'system','qr-return-service','თქვენი ' || v_period_label || ' მომსახურება გააქტიურდა. მოქმედების ვადა: ' || to_char(v_end at time zone 'Asia/Tbilisi','DD.MM.YYYY HH24:MI') || '-მდე.');
  end if;
  return new;
end; $$;
