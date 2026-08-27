select setval(
  pg_get_serial_sequence('public.item', 'id'),
  greatest(coalesce((select max(id) from public.item), 0), 1),
  true
);
