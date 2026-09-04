# Encuesta Awareness CEIPA (PWA)

Progressive Web App offline-first para digitalizar la **Encuesta de Recordación de Marca (Awareness) — CEIPA**.

Las respuestas se guardan primero en el navegador (IndexedDB vía Dexie). Cuando hay internet, se sincronizan automáticamente con Supabase. Incluye exportación a Excel como respaldo.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- `@ducanh2912/next-pwa` (Service Worker + caché del App Shell)
- Dexie.js (IndexedDB local)
- `@supabase/supabase-js` (sincronización)
- SheetJS / `xlsx` (exportación Excel)
- Despliegue en Vercel

## 1. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com).
2. Abre **SQL Editor** y ejecuta el archivo [`supabase/schema.sql`](./supabase/schema.sql).
3. Copia la **Project URL** y la **anon public key** desde *Project Settings → API*.

El SQL crea la tabla `encuestas_ceipa` con RLS:

- `INSERT` permitido para `anon` / `authenticated` (sin login de encuestadores)
- `SELECT` / `UPDATE` / `DELETE` públicos bloqueados por defecto

## 2. Variables de entorno

Copia el ejemplo y completa los valores:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

En Vercel, define las mismas variables en *Project Settings → Environment Variables*.

## 3. Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> El Service Worker se desactiva en desarrollo (`disable` cuando `NODE_ENV === "development"`). Para probar la PWA offline, usa un build de producción.

## 4. Probar offline / instalación PWA

```bash
npm run build
npm start
```

Luego:

1. Abre la app en Chrome o Safari (desktop o móvil).
2. Espera a que cargue una vez **con internet** (el SW cachea el App Shell).
3. Activa modo avión / DevTools → Network → Offline.
4. Recarga: el formulario debe seguir disponible.
5. Guarda encuestas; aparecerán como pendientes.
6. Restaura la conexión: sincronización automática (también cada 30 s y con el botón **Sincronizar ahora**).
7. En móvil: *Agregar a pantalla de inicio* / *Install app*.

## 5. Despliegue en Vercel

1. Sube el repositorio a GitHub/GitLab/Bitbucket.
2. Importa el proyecto en [Vercel](https://vercel.com).
3. Configura `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Framework preset: **Next.js**.

## Funcionamiento offline-first

1. Al enviar, **siempre** se guarda en Dexie (`encuestas_local`) con `sincronizado: false`.
2. El hook `useSyncStatus` escucha `online` / `offline`, muestra el banner de estado y reintenta cada 30 s.
3. Al sincronizar, hace `upsert` en Supabase y marca los registros locales como `sincronizado: true`.
4. Si falla la red, los datos locales no se pierden.
5. **Exportar respaldo a Excel** descarga todo lo almacenado en IndexedDB.

## Estructura

```
app/                 # Rutas Next.js (App Router)
components/          # Secciones del formulario y banner de sync
lib/
  db.ts              # Dexie / IndexedDB
  supabase.ts        # Cliente Supabase
  sync.ts            # Lógica de sincronización
  export.ts          # Exportación xlsx
  useSyncStatus.ts   # Hook online/offline + contadores
  types.ts           # Tipos y opciones del formulario
public/
  manifest.json
  icons/
supabase/
  schema.sql
```

## Notas

- Los campos de control (encuestador, punto, fecha) se conservan tras cada guardado para agilizar el trabajo en campo.
- Si la edad es “Menor de 16 / mayor de 50”, se guarda un registro con `no_aplica = true` sin el resto de preguntas.
- Safari iOS: la PWA instalada en pantalla de inicio ofrece el mejor comportamiento offline; en la primera visita con red se cachea el shell.
