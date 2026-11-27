-- ============================================================================
-- ZAINO · esquema de base de datos (Supabase / PostgreSQL)
-- Pega este archivo entero en Supabase → SQL Editor → Run.
--
-- Modelo:
--   viajes                 un viaje; `data` jsonb con fechas, integrantes, plan, reservas…
--   miembros               qué usuario (auth.uid, también anónimo) ocupa qué plaza (m1, m2…)
--   respuestas             respuestas del cuestionario que ve el grupo
--   respuestas_privadas    presupuesto ideal/máximo, fechas que no puedes: solo tú y el servidor
--   resultados             propuestas calculadas por el motor (solo escribe el servidor)
--   gastos, lista          gastos compartidos y checklist del viaje
--   ia_uso                 contador diario para limitar el gasto de la IA
-- Todo el acceso pasa por RLS. Las operaciones delicadas van por funciones RPC
-- (security definer) que comprueban permisos.
-- ============================================================================

create extension if not exists pgcrypto; -- en Supabase ya existe en el esquema «extensions»: por eso las funciones llevan search_path = public, extensions

-- ---------- tablas ----------
create table if not exists public.viajes (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique check (code ~ '^[A-Z0-9]{6}$'),
  token       text not null unique,
  creador     uuid not null,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.miembros (
  viaje_id    uuid not null references public.viajes(id) on delete cascade,
  miembro     text not null check (miembro ~ '^m[0-9]{1,3}$'),
  user_id     uuid,
  rol         text not null default 'participante' check (rol in ('organizador','participante')),
  created_at  timestamptz not null default now(),
  primary key (viaje_id, miembro),
  unique (viaje_id, user_id)
);

create table if not exists public.respuestas (
  viaje_id    uuid not null references public.viajes(id) on delete cascade,
  miembro     text not null,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (viaje_id, miembro)
);

create table if not exists public.respuestas_privadas (
  viaje_id    uuid not null references public.viajes(id) on delete cascade,
  miembro     text not null,
  user_id     uuid not null,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  primary key (viaje_id, miembro)
);

create table if not exists public.resultados (
  viaje_id    uuid primary key references public.viajes(id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.gastos (
  id          uuid primary key default gen_random_uuid(),
  viaje_id    uuid not null references public.viajes(id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create table if not exists public.lista (
  id          uuid primary key default gen_random_uuid(),
  viaje_id    uuid not null references public.viajes(id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create table if not exists public.ia_uso (
  viaje_id    uuid not null references public.viajes(id) on delete cascade,
  dia         date not null default current_date,
  n           int not null default 0,
  primary key (viaje_id, dia)
);

create index if not exists miembros_user on public.miembros(user_id);
create index if not exists gastos_viaje on public.gastos(viaje_id);
create index if not exists lista_viaje on public.lista(viaje_id);

-- ---------- utilidades ----------
-- Mezcla profunda de jsonb (los objetos se mezclan; arrays y valores se sustituyen;
-- un valor {"__delete__": true} borra la clave).
create or replace function public.jsonb_mezclar(a jsonb, b jsonb) returns jsonb
language plpgsql immutable as $$
declare k text; v jsonb; r jsonb;
begin
  if a is null or jsonb_typeof(a) <> 'object' or jsonb_typeof(b) <> 'object' then return b; end if;
  r := a;
  for k, v in select * from jsonb_each(b) loop
    if jsonb_typeof(v) = 'object' and v ? '__delete__' then
      r := r - k;
    elsif jsonb_typeof(v) = 'object' and jsonb_typeof(r->k) = 'object' then
      r := jsonb_set(r, array[k], public.jsonb_mezclar(r->k, v));
    else
      r := jsonb_set(r, array[k], v);
    end if;
  end loop;
  return r;
end $$;

create or replace function public.es_miembro(v uuid) returns boolean
language sql stable security definer set search_path = public, extensions as $$
  select exists(select 1 from public.miembros m where m.viaje_id = v and m.user_id = auth.uid());
$$;

create or replace function public.es_organizador(v uuid) returns boolean
language sql stable security definer set search_path = public, extensions as $$
  select exists(select 1 from public.miembros m where m.viaje_id = v and m.user_id = auth.uid() and m.rol = 'organizador');
$$;

create or replace function public.mi_miembro(v uuid) returns text
language sql stable security definer set search_path = public, extensions as $$
  select m.miembro from public.miembros m where m.viaje_id = v and m.user_id = auth.uid();
$$;

-- ---------- RLS ----------
alter table public.viajes enable row level security;
alter table public.miembros enable row level security;
alter table public.respuestas enable row level security;
alter table public.respuestas_privadas enable row level security;
alter table public.resultados enable row level security;
alter table public.gastos enable row level security;
alter table public.lista enable row level security;
alter table public.ia_uso enable row level security;

drop policy if exists viajes_leer on public.viajes;
create policy viajes_leer on public.viajes for select using (public.es_miembro(id));
-- (sin políticas de insert/update/delete: solo por RPC)

drop policy if exists miembros_leer on public.miembros;
create policy miembros_leer on public.miembros for select using (public.es_miembro(viaje_id));

drop policy if exists resp_leer on public.respuestas;
create policy resp_leer on public.respuestas for select using (public.es_miembro(viaje_id));
drop policy if exists resp_escribir on public.respuestas;
create policy resp_escribir on public.respuestas for insert with check (public.mi_miembro(viaje_id) = miembro);
drop policy if exists resp_cambiar on public.respuestas;
create policy resp_cambiar on public.respuestas for update using (public.mi_miembro(viaje_id) = miembro) with check (public.mi_miembro(viaje_id) = miembro);
drop policy if exists resp_borrar on public.respuestas;
create policy resp_borrar on public.respuestas for delete using (public.mi_miembro(viaje_id) = miembro);

drop policy if exists priv_propias on public.respuestas_privadas;
create policy priv_propias on public.respuestas_privadas for all
  using (user_id = auth.uid() and public.mi_miembro(viaje_id) = miembro)
  with check (user_id = auth.uid() and public.mi_miembro(viaje_id) = miembro);

drop policy if exists res_leer on public.resultados;
create policy res_leer on public.resultados for select using (public.es_miembro(viaje_id));

drop policy if exists gastos_todo on public.gastos;
create policy gastos_todo on public.gastos for all using (public.es_miembro(viaje_id)) with check (public.es_miembro(viaje_id));
drop policy if exists lista_todo on public.lista;
create policy lista_todo on public.lista for all using (public.es_miembro(viaje_id)) with check (public.es_miembro(viaje_id));
-- ia_uso: sin políticas (solo el servidor)

-- ---------- RPC ----------
-- Crear viaje: genera código, token de invitación y la plaza del organizador.
create or replace function public.crear_viaje(p_data jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v_id uuid; v_code text; v_token text; i int := 0; alfabeto text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
begin
  if auth.uid() is null then raise exception 'sin_sesion'; end if;
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

-- Vista previa de una invitación: solo título, fechas y nombres (sin respuestas).
create or replace function public.previa_invitacion(p_token text) returns jsonb
language plpgsql stable security definer set search_path = public, extensions as $$
declare v viajes%rowtype;
begin
  select * into v from viajes where token = p_token;
  if not found then return null; end if;
  return jsonb_build_object(
    'id', v.id, 'code', v.code,
    'titulo', v.data->'titulo', 'fechas', v.data->'fechas', 'dias', v.data->'dias', 'jefe', v.data->'jefe',
    'integrantes', (select coalesce(jsonb_agg(jsonb_build_object('id', i->>'id', 'nombre', i->>'nombre',
        'ocupado', exists(select 1 from miembros m where m.viaje_id = v.id and m.miembro = i->>'id' and m.user_id is not null),
        'soy_yo', exists(select 1 from miembros m where m.viaje_id = v.id and m.miembro = i->>'id' and m.user_id = auth.uid()))), '[]'::jsonb)
      from jsonb_array_elements(coalesce(v.data->'integrantes','[]'::jsonb)) i),
    'ya_dentro', public.es_miembro(v.id));
end $$;

-- Unirse con el token: ocupar una plaza libre (p_miembro) o crear una nueva con p_nombre.
create or replace function public.unirse_viaje(p_token text, p_miembro text, p_nombre text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v viajes%rowtype; ocupante uuid; nuevo text; n int; mio text;
begin
  if auth.uid() is null then raise exception 'sin_sesion'; end if;
  select * into v from viajes where token = p_token for update;
  if not found then raise exception 'invitacion_no_valida'; end if;
  mio := public.mi_miembro(v.id);
  if mio is not null then return jsonb_build_object('code', v.code, 'miembro', mio); end if;
  if p_miembro is not null then
    if not exists(select 1 from jsonb_array_elements(coalesce(v.data->'integrantes','[]'::jsonb)) i where i->>'id' = p_miembro) then raise exception 'plaza_no_existe'; end if;
    select user_id into ocupante from miembros where viaje_id = v.id and miembro = p_miembro;
    if ocupante is not null then raise exception 'plaza_ocupada'; end if;
    insert into miembros(viaje_id, miembro, user_id) values (v.id, p_miembro, auth.uid())
      on conflict (viaje_id, miembro) do update set user_id = excluded.user_id;
    return jsonb_build_object('code', v.code, 'miembro', p_miembro);
  end if;
  if coalesce(trim(p_nombre),'') = '' then raise exception 'falta_nombre'; end if;
  select coalesce(max(substr(i->>'id',2)::int),0) + 1 into n from jsonb_array_elements(coalesce(v.data->'integrantes','[]'::jsonb)) i;
  if n > 30 then raise exception 'viaje_lleno'; end if;
  nuevo := 'm' || n;
  update viajes set data = jsonb_set(data, '{integrantes}', coalesce(data->'integrantes','[]'::jsonb) || jsonb_build_array(jsonb_build_object('id', nuevo, 'nombre', left(trim(p_nombre), 24)))), updated_at = now() where id = v.id;
  insert into miembros(viaje_id, miembro, user_id) values (v.id, nuevo, auth.uid());
  return jsonb_build_object('code', v.code, 'miembro', nuevo);
end $$;

-- Parche del viaje con mezcla profunda. Integrantes, jefe y ajustes solo los toca el organizador.
create or replace function public.parchear_viaje(p_code text, p_patch jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare v viajes%rowtype; clave text;
begin
  select * into v from viajes where code = p_code for update;
  if not found or not public.es_miembro(v.id) then raise exception 'sin_permiso'; end if;
  if not public.es_organizador(v.id) then
    foreach clave in array array['integrantes','jefe','titulo','fechas','dias','presupuesto','destinos','observaciones','ocasion','code'] loop
      if p_patch ? clave then raise exception 'solo_organizador'; end if;
    end loop;
    if p_patch ? 'eleccion' and (p_patch->'eleccion') ? 'zona' then raise exception 'solo_organizador'; end if;
  end if;
  update viajes set data = public.jsonb_mezclar(data, p_patch - 'code'), updated_at = now() where id = v.id returning * into v;
  return v.data;
end $$;

-- Organizador: quitar a alguien (borra su plaza, sus respuestas y su parte privada).
create or replace function public.quitar_integrante(p_code text, p_miembro text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare v viajes%rowtype;
begin
  select * into v from viajes where code = p_code for update;
  if not found or not public.es_organizador(v.id) then raise exception 'sin_permiso'; end if;
  if p_miembro = public.mi_miembro(v.id) then raise exception 'no_puedes_quitarte'; end if;
  delete from respuestas where viaje_id = v.id and miembro = p_miembro;
  delete from respuestas_privadas where viaje_id = v.id and miembro = p_miembro;
  delete from miembros where viaje_id = v.id and miembro = p_miembro;
  update viajes set data = jsonb_set(data, '{integrantes}', coalesce((select jsonb_agg(i) from jsonb_array_elements(data->'integrantes') i where i->>'id' <> p_miembro), '[]'::jsonb)), updated_at = now() where id = v.id;
end $$;

-- Participante: salir del viaje (borra tus respuestas; tu nombre queda libre para otra persona).
create or replace function public.salir_viaje(p_code text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare v viajes%rowtype; mio text;
begin
  select * into v from viajes where code = p_code;
  if not found then return; end if;
  mio := public.mi_miembro(v.id);
  if mio is null then return; end if;
  if public.es_organizador(v.id) then raise exception 'organizador_no_puede_salir'; end if;
  delete from respuestas where viaje_id = v.id and miembro = mio;
  delete from respuestas_privadas where viaje_id = v.id and miembro = mio;
  delete from miembros where viaje_id = v.id and miembro = mio;
end $$;

-- Organizador: nuevo enlace de invitación (el anterior deja de funcionar).
create or replace function public.regenerar_invitacion(p_code text) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare v_id uuid; t text;
begin
  select id into v_id from viajes where code = p_code;
  if v_id is null or not public.es_organizador(v_id) then raise exception 'sin_permiso'; end if;
  t := encode(gen_random_bytes(18), 'hex');
  update viajes set token = t, updated_at = now() where id = v_id;
  return t;
end $$;

-- RGPD: borrar todo lo mío (respuestas, privadas, plazas). Los viajes que organizo se borran enteros.
create or replace function public.borrar_mis_datos() returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  delete from viajes where id in (select viaje_id from miembros where user_id = auth.uid() and rol = 'organizador');
  delete from respuestas r using miembros m where m.viaje_id = r.viaje_id and m.miembro = r.miembro and m.user_id = auth.uid();
  delete from respuestas_privadas where user_id = auth.uid();
  delete from miembros where user_id = auth.uid();
end $$;

-- Permisos de ejecución
revoke all on function public.crear_viaje(jsonb) from public;
revoke all on function public.previa_invitacion(text) from public;
revoke all on function public.unirse_viaje(text, text, text) from public;
revoke all on function public.parchear_viaje(text, jsonb) from public;
revoke all on function public.quitar_integrante(text, text) from public;
revoke all on function public.salir_viaje(text) from public;
revoke all on function public.regenerar_invitacion(text) from public;
revoke all on function public.borrar_mis_datos() from public;
do $$ begin if exists (select 1 from pg_roles where rolname = 'anon') then
  execute 'revoke all on function public.crear_viaje(jsonb), public.previa_invitacion(text), public.unirse_viaje(text, text, text), public.parchear_viaje(text, jsonb), public.quitar_integrante(text, text), public.salir_viaje(text), public.regenerar_invitacion(text), public.borrar_mis_datos() from anon';
end if; end $$;
grant execute on function public.crear_viaje(jsonb), public.previa_invitacion(text), public.unirse_viaje(text, text, text),
  public.parchear_viaje(text, jsonb), public.quitar_integrante(text, text), public.salir_viaje(text),
  public.regenerar_invitacion(text), public.borrar_mis_datos() to authenticated;

grant select on public.viajes, public.miembros, public.resultados to authenticated;
grant select, insert, update, delete on public.respuestas, public.respuestas_privadas, public.gastos, public.lista to authenticated;

-- El token de invitación solo lo ve quien ya es miembro (va en la fila del viaje, protegida por RLS).


-- Solo el servidor (función motor, con la clave service_role) escribe el plan calculado.
create or replace function public.servidor_parchear(p_id uuid, p_patch jsonb) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare d jsonb;
begin
  update viajes set data = public.jsonb_mezclar(data, p_patch - 'code'), updated_at = now() where id = p_id returning data into d;
  return d;
end $$;
revoke all on function public.servidor_parchear(uuid, jsonb) from public;
-- en Supabase los permisos por defecto dan EXECUTE a anon y authenticated: se quitan explícitamente
do $$ begin if exists (select 1 from pg_roles where rolname = 'anon') then execute 'revoke all on function public.servidor_parchear(uuid, jsonb) from anon'; end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then execute 'revoke all on function public.servidor_parchear(uuid, jsonb) from authenticated'; end if; end $$;
do $$ begin if exists (select 1 from pg_roles where rolname = 'service_role') then
  execute 'grant execute on function public.servidor_parchear(uuid, jsonb) to service_role';
end if; end $$;

-- Contador de uso de la IA (lo llama la función zaino-ia con service_role)
create or replace function public.ia_contar(p_viaje uuid, p_limite int) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare n_ int;
begin
  insert into ia_uso(viaje_id, dia, n) values (p_viaje, current_date, 1)
    on conflict (viaje_id, dia) do update set n = ia_uso.n + 1 returning n into n_;
  return n_ <= p_limite;
end $$;
revoke all on function public.ia_contar(uuid, int) from public;
do $$ begin if exists (select 1 from pg_roles where rolname = 'anon') then execute 'revoke all on function public.ia_contar(uuid, int) from anon'; end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then execute 'revoke all on function public.ia_contar(uuid, int) from authenticated'; end if; end $$;
do $$ begin if exists (select 1 from pg_roles where rolname = 'service_role') then
  execute 'grant execute on function public.ia_contar(uuid, int) to service_role';
end if; end $$;

-- ---------- tiempo real ----------
do $$ begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin alter publication supabase_realtime add table public.viajes, public.miembros, public.respuestas, public.resultados, public.gastos, public.lista; exception when duplicate_object then null; end;
  end if;
end $$;
