-- Endurecimiento tras la revisión del Tester (A1, A2, A3). Migración nueva: no toca las anteriores.
begin;

-- A1. El avatar de una respuesta solo puede ser un JPEG en base64 (lo que genera la app).
-- Primero se limpian los avatares que no cumplan; la restricción vale para todo lo que se escriba desde ahora.
update public.respuestas set data = data - 'avatar'
where data ? 'avatar' and not (
  jsonb_typeof(data->'avatar') = 'string'
  and length(data->>'avatar') <= 60000
  and data->>'avatar' ~ '^data:image/jpeg;base64,[A-Za-z0-9+/]+={0,2}$');

alter table public.respuestas drop constraint if exists respuestas_avatar_valido;
alter table public.respuestas add constraint respuestas_avatar_valido
  check (not (data ? 'avatar') or (
    jsonb_typeof(data->'avatar') = 'string'
    and length(data->>'avatar') <= 60000
    and data->>'avatar' ~ '^data:image/jpeg;base64,[A-Za-z0-9+/]+={0,2}$'));

-- A3. Los ids de integrantes (y el jefe) son «m» + 1 a 3 cifras.
create or replace function public.ids_integrantes_validos(p jsonb) returns boolean
language sql immutable as $$
  select p is null or (jsonb_typeof(p) = 'array' and not exists(
    select 1 from jsonb_array_elements(p) i
    where jsonb_typeof(i) <> 'object' or jsonb_typeof(i->'id') <> 'string' or (i->>'id') !~ '^m[0-9]{1,3}$'));
$$;

create or replace function public.crear_viaje(p_data jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v_id uuid; v_code text; v_token text; i int := 0; alfabeto text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
begin
  if auth.uid() is null then raise exception 'sin_sesion'; end if;
  if p_data is not null and jsonb_typeof(p_data) <> 'object' then raise exception 'datos_no_validos'; end if;
  if not public.ids_integrantes_validos(p_data->'integrantes') then raise exception 'integrantes_no_validos'; end if;
  if p_data ? 'jefe' and coalesce(p_data->>'jefe','') !~ '^m[0-9]{1,3}$' then raise exception 'integrantes_no_validos'; end if;
  loop
    v_code := '';
    for j in 1..6 loop v_code := v_code || substr(alfabeto, 1 + floor(random()*length(alfabeto))::int, 1); end loop;
    exit when not exists(select 1 from viajes where code = v_code);
    i := i + 1; if i > 20 then raise exception 'no_hay_codigo'; end if;
  end loop;
  v_token := encode(gen_random_bytes(18), 'hex');
  insert into viajes(code, token, creador, data)
    values (v_code, v_token, auth.uid(), jsonb_set(coalesce(p_data,'{}'::jsonb), '{code}', to_jsonb(v_code)))
    returning id into v_id;
  insert into miembros(viaje_id, miembro, user_id, rol) values (v_id, coalesce(p_data->>'jefe','m1'), auth.uid(), 'organizador');
  return jsonb_build_object('id', v_id, 'code', v_code, 'token', v_token);
end $$;

-- A2 + A3. El parche tiene que ser un objeto; un participante no toca la elección de destino
-- ni cambia plan.zona; los ids de integrantes se validan.
create or replace function public.parchear_viaje(p_code text, p_patch jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v viajes%rowtype; clave text;
begin
  if p_patch is null or jsonb_typeof(p_patch) <> 'object' then raise exception 'patch_no_valido'; end if;
  select * into v from viajes where code = p_code for update;
  if not found or not public.es_miembro(v.id) then raise exception 'sin_permiso'; end if;
  if not public.es_organizador(v.id) then
    foreach clave in array array['integrantes','jefe','titulo','fechas','dias','presupuesto','destinos','observaciones','ocasion','code'] loop
      if p_patch ? clave then raise exception 'solo_organizador'; end if;
    end loop;
    if p_patch ? 'eleccion' then raise exception 'solo_organizador'; end if;
    if p_patch ? 'plan' then
      if jsonb_typeof(p_patch->'plan') <> 'object' or (p_patch->'plan') ? '__delete__' then raise exception 'plan_no_valido'; end if;
      if (p_patch->'plan') ? 'zona' and (p_patch->'plan'->>'zona') is distinct from (v.data->'plan'->>'zona') then raise exception 'solo_organizador'; end if;
    end if;
  end if;
  if p_patch ? 'integrantes' and not public.ids_integrantes_validos(p_patch->'integrantes') then raise exception 'integrantes_no_validos'; end if;
  if p_patch ? 'jefe' and coalesce(p_patch->>'jefe','') !~ '^m[0-9]{1,3}$' then raise exception 'integrantes_no_validos'; end if;
  update viajes set data = public.jsonb_mezclar(data, p_patch - 'code'), updated_at = now() where id = v.id returning * into v;
  return v.data;
end $$;

commit;
