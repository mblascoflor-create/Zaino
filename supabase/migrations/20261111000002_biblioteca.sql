-- Biblioteca de destinos en tablas (lectura pública, escritura solo desde el panel o el servidor).
-- La IA de Zaino la consulta con consultas estructuradas (no hace falta búsqueda vectorial por ahora).
create table if not exists public.lib_destinos (
  id text primary key, pais text not null default 'IT', nombre text not null, nombre_corto text, lema text,
  perfil jsonb, nivel_precio text, meses jsonb, calor_verano text, nieve_invierno boolean,
  coche jsonb, llegar jsonb, moverse jsonb, notas_honestas jsonb, costes jsonb
);
create table if not exists public.lib_bases (
  destino_id text not null references public.lib_destinos(id) on delete cascade, id text not null,
  nombre text, por_que text, ambiente text, sin_coche boolean, primary key (destino_id, id)
);
create table if not exists public.lib_actividades (
  destino_id text not null references public.lib_destinos(id) on delete cascade, id text not null,
  base_id text, nombre text not null, donde text, tipo text, tipos_extra text[], duracion text, momento text,
  coste text, requiere_coche boolean, requiere_reserva boolean, esfuerzo text, ambiente text, meses int[],
  descripcion text, consejo text, enlace text, enlace_tipo text, maps text, fuente text, lat double precision, lon double precision,
  primary key (destino_id, id)
);
create table if not exists public.lib_comida (id serial primary key, destino_id text references public.lib_destinos(id) on delete cascade, plato text, que_es text, estilo text, coste text, donde text, maps text);
create table if not exists public.lib_noche (id serial primary key, destino_id text references public.lib_destinos(id) on delete cascade, base_id text, zona text, plan text, descripcion text, maps text, lat double precision, lon double precision);
create table if not exists public.lib_alojamiento (id serial primary key, destino_id text references public.lib_destinos(id) on delete cascade, base_id text, tipo text, coste text, para text, enlaces jsonb);
create table if not exists public.lib_eventos (id serial primary key, destino_id text references public.lib_destinos(id) on delete cascade, nombre text, donde text, cuando text, meses int[], proxima_fecha text, enlace text, descripcion text);
create index if not exists lib_act_tipo on public.lib_actividades(destino_id, tipo);

do $$ declare t text; begin
  foreach t in array array['lib_destinos','lib_bases','lib_actividades','lib_comida','lib_noche','lib_alojamiento','lib_eventos'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists leer_todos on public.%I', t);
    execute format('create policy leer_todos on public.%I for select using (true)', t);
    execute format('grant select on public.%I to anon, authenticated', t);
  end loop;
end $$;
