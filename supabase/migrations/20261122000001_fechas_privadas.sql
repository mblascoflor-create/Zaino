begin;

-- Conserva la disponibilidad de las respuestas antiguas en su parte privada.
insert into public.respuestas_privadas (viaje_id, miembro, user_id, data)
select r.viaje_id, r.miembro, m.user_id,
       jsonb_strip_nulls(jsonb_build_object('meses', r.data->'meses', 'dias', r.data->'dias'))
from public.respuestas r
join public.miembros m using (viaje_id, miembro)
where m.user_id is not null and r.data ?| array['meses', 'dias']
on conflict (viaje_id, miembro) do update
set data = excluded.data || respuestas_privadas.data;

update public.respuestas set data = data - array['meses', 'dias']
where data ?| array['meses', 'dias'];

-- Los resultados antiguos con disponibilidad nominativa se vuelven a calcular al abrir el viaje.
delete from public.resultados where data->'fechas' ? 'quienNo'
  and data->'fechas'->'quienNo' <> '[]'::jsonb;

alter table public.respuestas add constraint respuestas_fechas_privadas
  check (not (data ?| array['meses', 'dias', 'presIdeal', 'presMax', 'fechasOk', 'fechasNo'])) not valid;

commit;
