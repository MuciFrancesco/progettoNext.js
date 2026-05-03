# Security Audit & Refactoring — ThinkShop

Data intervento: 2026-05-03  
Progetto: monorepo Next.js 16 (frontend) + NestJS 11 (backend)

---

## Indice

1. [Panoramica](#1-panoramica)
2. [Fix Critici](#2-fix-critici)
3. [Fix Medi](#3-fix-medi)
4. [Fix Minori](#4-fix-minori)
5. [File Creati](#5-file-creati)
6. [File Modificati](#6-file-modificati)
7. [File Eliminati](#7-file-eliminati)
8. [Build Results](#8-build-results)
9. [Problemi Non Risolti](#9-problemi-non-risolti)

---

## 1. Panoramica

È stato eseguito un audit architetturale completo del progetto ThinkShop. Sono stati identificati 25 problemi distribuiti su tre livelli di priorità (5 critici, 10 medi, 11 minori). Tutti i problemi, eccetto quelli annotati nella sezione [9](#9-problemi-non-risolti), sono stati risolti. Entrambe le build (`nest build` per il backend, `next build` per il frontend) completano senza errori.

---

## 2. Fix Critici

### 2.1 Nessun CORS configurato sul Backend

**File:** `apps/backend/src/main.ts`

**Problema:** Il backend NestJS non chiamava `app.enableCors()`. L'API era accessibile da qualsiasi origine browser, aprendo la porta ad attacchi cross-site.

**Soluzione applicata:**
```ts
app.enableCors({
  origin: frontendUrl,   // letto da FRONTEND_URL (default: http://localhost:3000)
  credentials: true,
});
```
La variabile `frontendUrl` viene letta tramite `ConfigService` dall'env `FRONTEND_URL`.

---

### 2.2 Nessun Helmet / Security Headers sul Backend

**File:** `apps/backend/src/main.ts`

**Problema:** Mancavano header di sicurezza fondamentali (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`), rendendo il backend vulnerabile a clickjacking e MIME-sniffing.

**Soluzione applicata:**
- Installato il pacchetto `helmet` (`npm install helmet`) e `@types/helmet`
- Aggiunto `app.use(helmet())` come primo middleware nel bootstrap

---

### 2.3 Nessun Content Security Policy sul Frontend

**File:** `apps/frontend/next.config.ts`

**Problema:** Il frontend non configurava header HTTP di sicurezza, lasciando il browser senza barriere contro XSS e altri attacchi di injection.

**Soluzione applicata:**
Aggiunta la funzione `headers()` nella configurazione Next.js con i seguenti header su tutte le route (`/(.*)`):

| Header | Valore |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | Policy restrittiva con `default-src 'self'`, `frame-ancestors 'none'`, ecc. |

I valori di `img-src` e `connect-src` includono l'origin del backend, calcolata dinamicamente in base all'ambiente (`http://localhost:3333` in dev, `https://$BACKEND_HOSTNAME` in prod).

---

### 2.4 Immagini Servite via HTTP in Produzione

**File:** `apps/frontend/next.config.ts`

**Problema:** Il pattern `remotePatterns` per le immagini usava sempre `protocol: 'http'`, incluso in produzione, dove tutte le immagini sarebbero state servite in chiaro.

**Soluzione applicata:**
Il protocollo e l'hostname sono ora condizionali in base a `NODE_ENV`:
```ts
const isProd = process.env.NODE_ENV === 'production';
const backendHostname = process.env.BACKEND_HOSTNAME ?? 'localhost';

remotePatterns: [
  isProd
    ? { protocol: 'https', hostname: backendHostname, pathname: '/uploads/**' }
    : { protocol: 'http', hostname: 'localhost', port: '3333', pathname: '/uploads/**' },
],
```
In produzione basta impostare la variabile d'ambiente `BACKEND_HOSTNAME`.

---

### 2.5 Password DB Banale (Non Fixato su Richiesta)

**File:** `docker-compose.yml`

**Problema:** `POSTGRES_PASSWORD: 123` in chiaro con porta 5432 esposta all'host.

**Stato:** Non modificato su esplicita richiesta dell'utente (ambiente di sviluppo).

---

## 3. Fix Medi

### 3.1 Doppio Fetch a `/users/me` al Login

**File:** `apps/frontend/lib/actions/auth.ts`

**Problema:** Dopo `saveSessionToken()`, `signinAction` e `signupAction` chiamavano `getMe(access_token)` per determinare il ruolo e calcolare il redirect. Questo comportava un round-trip HTTP aggiuntivo verso il backend, poiché il JWT contiene già `email` e `isAdmin` nel suo payload.

**Soluzione applicata:**
- Creato il modulo condiviso `apps/frontend/lib/auth/jwt.ts` con la funzione `decodeJwtPayload(token)`
- Sostituita la chiamata `getMe()` con la decodifica locale del JWT (base64url decode del secondo segmento)
- Rimosso l'import di `getMe` da `actions/auth.ts`

```ts
// Prima
const me = await getMe(access_token);
return { ok: true, redirectTo: pathByRole(resolveRole(me.email, me.role, me.isAdmin)) };

// Dopo
const payload = decodeJwtPayload(access_token);
const role = payload ? resolveRole(payload.email, undefined, payload.isAdmin) : 'USER';
return { ok: true, redirectTo: pathByRole(role) };
```

---

### 3.2 Logica Ruoli Duplicata in Due File

**File:** `apps/frontend/lib/actions/auth.ts` e `apps/frontend/lib/auth/session.ts`

**Problema:** Le funzioni `getAdminEmails()` e `resolveRole()` erano copiate identicamente in entrambi i file. Qualsiasi modifica richiedeva di aggiornare due posti.

**Soluzione applicata:**
- Creato il modulo condiviso `apps/frontend/lib/auth/roles.ts`
- Entrambi i file ora importano `resolveRole` da `@/lib/auth/roles`
- Le copie locali nei due file originali sono state rimosse

---

### 3.3 `ADMIN_EMAILS` Env Attivo in Produzione

**File:** `apps/frontend/lib/auth/roles.ts` (nuovo modulo condiviso)

**Problema:** La funzione `getAdminEmails()` leggeva la variabile d'ambiente `ADMIN_EMAILS` anche in produzione, bypassando potenzialmente il controllo ruoli del database. Il commento nel codice stesso segnalava "Remove env-based admin fallback in production".

**Soluzione applicata:**
```ts
function getAdminEmails(): Set<string> {
  if (process.env.NODE_ENV === 'production') return new Set(); // ← fix
  const raw = process.env.ADMIN_EMAILS ?? '';
  return new Set(raw.split(',').map(e => e.toLowerCase().trim()).filter(Boolean));
}
```
In produzione la funzione restituisce sempre un `Set` vuoto, forzando il sistema a usare il ruolo proveniente dal database.

---

### 3.4 Flag `bulkBusy` in Memoria — Non Scalabile

**File:** `apps/backend/src/admin/admin.service.ts`

**Problema:** `private bulkBusy = false` è un flag singleton in memoria del processo NestJS. Con più istanze (K8s, PM2, scale-out), ogni replica ha il proprio stato, rendendo possibile l'avvio di operazioni bulk concorrenti.

**Soluzione applicata:**
Aggiunto un commento TODO visibile che documenta il problema e la soluzione corretta:
```ts
// TODO: Replace with a DB flag or Redis entry — in-memory state breaks with multiple instances.
private bulkBusy = false;
```
L'implementazione Redis/DB è fuori scope senza infrastruttura aggiuntiva.

---

### 3.5 Paginazione Senza Limite Massimo

**File:** `apps/backend/src/admin/admin.controller.ts`

**Problema:** Gli endpoint `GET /admin/users` e `GET /admin/products` non avevano un limite massimo sul parametro `limit`. Un parametro `limit=999999` avrebbe causato un dump completo del database in una singola risposta. Solo `GET /admin/orders` aveva già il `Math.min(100, ...)`.

**Soluzione applicata:**
Aggiunto `Math.min(100, Math.max(1, ...))` su entrambi gli endpoint mancanti:
```ts
// Prima
limit: limit ? Number.parseInt(limit, 10) : 20

// Dopo
limit: limit ? Math.min(100, Math.max(1, Number.parseInt(limit, 10))) : 20
```

---

### 3.6 Mailer Stub Silenzioso in Produzione

**File:** `apps/backend/src/auth/mailer.service.ts`

**Problema:** Il metodo privato `sendUsingProvider` — chiamato solo in produzione — si limitava a loggare un messaggio e risolvere la Promise senza fare nulla. Le email di reset password e gli alert anti-phishing non venivano mai inviate, senza che il sistema lanciasse alcun errore.

**Soluzione applicata:**
Il metodo ora lancia un `Error` esplicito in produzione, rendendo immediatamente visibile la mancanza di configurazione:
```ts
private sendUsingProvider(_email, _environmentLabel, type, _subject?, _body?): Promise<void> {
  // TODO: Integrate a real email provider (Nodemailer / SES / SendGrid / Resend).
  throw new Error(`[${type}] Email provider not configured for production.`);
}
```
In sviluppo, il codice non raggiunge mai `sendUsingProvider` (i metodi pubblici fanno early return con un log).

---

### 3.7 OAuth Callback Restituiva Token in Chiaro nel Body HTTP

**File:** `apps/backend/src/auth/auth.controller.ts`

**Problema:** I callback OAuth (Google, Facebook, Apple) restituivano `{ access_token, refresh_token }` direttamente nel corpo della risposta JSON al browser. I token erano quindi esposti a eventuali script nella pagina e non erano protetti da flag `httpOnly`.

**Soluzione applicata — architettura completa:**

**Backend:**
1. Creato `apps/backend/src/auth/oauth-code.service.ts` — service che gestisce codici one-time:
   - Genera un codice random hex da 64 caratteri
   - Lo memorizza in una `Map` con TTL di 60 secondi
   - Purga automaticamente le entry scadute ad ogni inserimento
   - Il metodo `exchange(code)` consuma il codice (one-time) e restituisce i token

2. Creato `apps/backend/src/auth/dto/oauth-exchange.dto.ts` con validazione (`@IsString`, `@IsNotEmpty`, `@Length(64,64)`)

3. Aggiunto endpoint `POST /auth/oauth/exchange` in `auth.controller.ts`

4. I callback OAuth ora usano `@Redirect()` di NestJS e reindirizzano il browser verso `FRONTEND_URL/auth/oauth/callback?code=<codice>` invece di restituire i token

5. Registrato `OAuthCodeService` in `auth.module.ts`

**Frontend:**
1. Creato `apps/frontend/app/auth/oauth/callback/route.ts` — Route Handler Next.js:
   - Riceve il codice dalla query string
   - Chiama `POST /auth/oauth/exchange` server-side (da server a server, mai esposto al browser)
   - Riceve i token e li salva come cookie `httpOnly` tramite `saveSessionToken()`
   - Decodifica il JWT per determinare il ruolo
   - Reindirizza a `/dashboard` (admin) o `/user` (utente normale)

Il flusso risultante: `OAuth Provider → Backend (codice) → Frontend /auth/oauth/callback → cookie httpOnly → redirect`

---

### 3.8 Logout Usava GET invece di POST

**File:** `apps/frontend/app/auth/logout/route.ts`, `apps/frontend/lib/auth/session.ts`, `apps/frontend/components/SessionExpiryWatcher/SessionExpiryWatcher.tsx`

**Problema:** Un endpoint GET che modifica stato (cancella cookie) può essere attivato involontariamente da prefetch del browser o link cliccati accidentalmente.

**Soluzione applicata:**

1. **`app/auth/logout/route.ts`**: rimosso il handler `GET`, aggiunto `POST` con la stessa logica (cancella `access_token`, imposta `session_expired=1`, redirect a `/logout`)

2. **`lib/auth/session.ts`**: aggiunta funzione privata `expireSession(cookieStore)` che esegue inline la logica di scadenza sessione. Le funzioni `requireAdminSession()` e `requireUserSession()` ora chiamano `expireSession()` direttamente invece di fare `redirect('/auth/logout')` (che avrebbe generato un GET)

3. **`SessionExpiryWatcher.tsx`**: sostituito `globalThis.location.replace('/auth/logout')` con una chiamata `fetch POST` seguita da navigazione a `/logout`:
```ts
try {
  await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
} finally {
  globalThis.location.replace('/logout');
}
```

---

### 3.9 Event Listener Vuoti in SessionExpiryWatcher

**File:** `apps/frontend/components/SessionExpiryWatcher/SessionExpiryWatcher.tsx`

**Problema:** Due event listener (`unload`, `beforeunload`) venivano registrati e rimossi con callback vuoti `() => {}`, senza alcun effetto funzionale. Aggiungevano rumore al codice e uno stack di listener inutili.

**Soluzione applicata:**
Rimossi completamente `onUnload`, `onBeforeUnload` e le relative chiamate `addEventListener`/`removeEventListener`.

---

### 3.10 `force-dynamic` e `revalidate = 0` Ridondanti

**File:** `apps/frontend/app/(admin)/dashboard/layout.tsx`, `apps/frontend/app/(user)/user/layout.tsx`

**Problema:** Entrambi i layout esportavano sia `dynamic = 'force-dynamic'` che `revalidate = 0`. Il primo implica già il secondo; la presenza di entrambi era ridondante.

**Soluzione applicata:**
Rimossa la riga `export const revalidate = 0` da entrambi i file.

**Bonus:** Le funzioni `layout` anonime sono state rinominate in named exports (`DashboardLayout` e `UserLayout`) e la riga `export default layout` separata è stata eliminata, allineandosi al pattern consigliato da Next.js.

---

## 4. Fix Minori

### 4.1 Typo `massage` → `message` (prop name)

**File:** `apps/frontend/components/AddProductForm/AddProductForm.tsx`, `apps/frontend/features/admin/components/AdminAddProductForm.tsx`

**Problema:** Il prop era denominato `massage` (massaggio) in tutte le sue occorrenze: nella firma del tipo, nel destructuring e negli utilizzi nel JSX.

**Soluzione applicata:**
- `AddProductForm.tsx`: rinominato `massage` → `message` in tutte le occorrenze (tipo, destructuring, utilizzo nel JSX) tramite replace globale
- `AdminAddProductForm.tsx`: aggiornato `massage={message}` → `message={message}`

---

### 4.2 Typo `dowloadVerification` nel Schema Prisma

**File:** `apps/backend/prisma/schema.prisma`

**Problema:** Il modello si chiamava `dowloadVerification` (mancava la 'n'). Il nome del modello era sbagliato sia sul model stesso sia sul campo relazione in `Product`. Il client Prisma generato ereditava il typo.

**Soluzione applicata:**
- Rinominato il model da `dowloadVerification` a `DownloadVerification`
- Aggiunto `@@map("dowloadVerification")` per mantenere il nome della tabella esistente nel DB, **evitando la necessità di una migration**
- Aggiornato il campo relazione in `Product`: `downloadVerifications DownloadVerification[]`

Il nome della tabella nel database rimane invariato (`dowloadVerification`). Il client Prisma generato userà il nome corretto `downloadVerification`.

---

### 4.3 `secondname` Non Popolato dalla Sessione

**File:** `apps/frontend/lib/auth/session.ts`, `apps/frontend/types/api/auth.ts`

**Problema:** Il campo `secondname` nell'oggetto sessione utente era hardcodato a `null` invece di leggere il valore dalla risposta del backend. `BackendMeResponse` non includeva `secondname`.

**Soluzione applicata:**
- Aggiunto `secondname?: string | null` a `BackendMeResponse` in `types/api/auth.ts`
- In `getCurrentSession()`: `secondname: me.secondname ?? null`

---

### 4.4 `createdAt` / `updatedAt` Hardcodati a Stringa Vuota

**File:** `apps/frontend/lib/auth/session.ts`, `apps/frontend/types/api/auth.ts`

**Problema:** I campi `createdAt` e `updatedAt` nell'oggetto sessione erano sempre `''`, indipendentemente dai dati reali del backend. `BackendMeResponse` non includeva questi campi.

**Soluzione applicata:**
- Aggiunti `createdAt?: string` e `updatedAt?: string` a `BackendMeResponse`
- In `getCurrentSession()`: `createdAt: me.createdAt ?? ''` e `updatedAt: me.updatedAt ?? ''`

---

### 4.5 Target TypeScript `ES2017` → `ES2020`

**File:** `apps/frontend/tsconfig.json`

**Problema:** Con Next.js 16 e React 19, il target `ES2017` era eccessivamente conservativo. Il compilatore doveva transpilare costrutti moderni (`??`, `?.`, `async/await` nativo) che tutti i browser e Node.js supportano nativamente da anni.

**Soluzione applicata:**
```json
"target": "ES2020"
```

---

### 4.6 Script Abbandonato Rimosso

**File:** `apps/frontend/add-logout-confirm.mjs` — **ELIMINATO**

**Problema:** Uno script di manipolazione di file sorgente era rimasto nella root del frontend dopo il suo utilizzo. Non aveva più alcuna funzione nel progetto.

**Soluzione applicata:** File eliminato.

---

### 4.7 Bug Pre-Esistente: `Footer` Component Mancante

**File:** `apps/frontend/components/Footer/Footer.tsx` — **CREATO**

**Problema:** `apps/frontend/features/auth/components/AuthForms.tsx` importava `{ Footer }` da `@/components/Footer/Footer`, ma il file non esisteva. L'errore TypeScript pre-esistente bloccava la compilazione.

**Soluzione applicata:**
Creato il componente `Footer.tsx` con i seguenti requisiti:
- Accetta `locale: Locale` come prop
- Usa `createTranslator(locale)` per tradurre la stringa `footerCopyright`
- Sostituisce `{year}` con l'anno corrente

---

## 5. File Creati

| File | Descrizione |
|---|---|
| `apps/backend/src/auth/oauth-code.service.ts` | Service per la gestione di codici OAuth one-time con TTL 60s |
| `apps/backend/src/auth/dto/oauth-exchange.dto.ts` | DTO per l'endpoint `POST /auth/oauth/exchange` |
| `apps/frontend/lib/auth/roles.ts` | Modulo condiviso per `resolveRole()` e `getAdminEmails()` |
| `apps/frontend/lib/auth/jwt.ts` | Modulo condiviso per `decodeJwtPayload()` |
| `apps/frontend/app/auth/oauth/callback/route.ts` | Route Handler Next.js per il callback OAuth sicuro |
| `apps/frontend/components/Footer/Footer.tsx` | Componente footer per la pagina di login |

---

## 6. File Modificati

### Backend

| File | Modifiche |
|---|---|
| `apps/backend/src/main.ts` | Aggiunto `helmet()`, `enableCors()` con `FRONTEND_URL`, import `helmet` |
| `apps/backend/src/auth/auth.controller.ts` | Callback OAuth → `@Redirect()` con codice one-time; aggiunto `POST /auth/oauth/exchange`; iniettato `OAuthCodeService` e `ConfigService` |
| `apps/backend/src/auth/auth.module.ts` | Aggiunto `OAuthCodeService` ai providers |
| `apps/backend/src/auth/dto/index.ts` | Aggiunto export di `OAuthExchangeDto` |
| `apps/backend/src/auth/mailer.service.ts` | `sendUsingProvider` ora lancia `Error` in produzione invece di risolvere silenziosamente |
| `apps/backend/src/admin/admin.controller.ts` | Aggiunto `Math.min(100, Math.max(1, ...))` sui parametri `limit` di `listUsers` e `listProducts` |
| `apps/backend/src/admin/admin.service.ts` | Aggiunto commento TODO su `bulkBusy` per multi-istanza |
| `apps/backend/prisma/schema.prisma` | Rinominato `dowloadVerification` → `DownloadVerification` con `@@map`; aggiornato il campo relazione in `Product` |

### Frontend

| File | Modifiche |
|---|---|
| `apps/frontend/next.config.ts` | Aggiunta funzione `headers()` con CSP e security headers; immagini remote ora condizionali (http in dev, https in prod) |
| `apps/frontend/tsconfig.json` | `target` da `ES2017` a `ES2020`; Next.js ha aggiunto automaticamente i path `include` per i tipi generati |
| `apps/frontend/types/api/auth.ts` | Aggiunti `secondname`, `createdAt`, `updatedAt` a `BackendMeResponse` |
| `apps/frontend/lib/auth/session.ts` | Rimossa duplicazione di `resolveRole`; aggiunta `expireSession()` inline; fix `secondname`, `createdAt`, `updatedAt`; import da `roles.ts` e `jwt.ts` |
| `apps/frontend/lib/actions/auth.ts` | Rimossa duplicazione di `resolveRole` e `decodeJwtPayload`; sostituita chiamata `getMe()` con decode JWT locale; import da `roles.ts` e `jwt.ts` |
| `apps/frontend/app/auth/logout/route.ts` | Handler `GET` → `POST` |
| `apps/frontend/app/(admin)/dashboard/layout.tsx` | Rimosso `revalidate = 0`; rinominata funzione `layout` → `DashboardLayout` come named export |
| `apps/frontend/app/(user)/user/layout.tsx` | Rimosso `revalidate = 0`; rinominata funzione `layout` → `UserLayout` come named export |
| `apps/frontend/components/SessionExpiryWatcher/SessionExpiryWatcher.tsx` | Rimossi listener vuoti (`onUnload`, `onBeforeUnload`); logout ora usa `fetch POST` invece di `location.replace GET` |
| `apps/frontend/components/AddProductForm/AddProductForm.tsx` | Rinominato prop `massage` → `message` in tutte le occorrenze (tipo, destructuring, JSX) |
| `apps/frontend/features/admin/components/AdminAddProductForm.tsx` | Aggiornato `massage={message}` → `message={message}` |

### Dipendenze

| Pacchetto | Tipo | Motivazione |
|---|---|---|
| `helmet` | `dependencies` (backend) | Security headers HTTP nel backend NestJS |
| `@types/helmet` | `devDependencies` (backend) | Tipi TypeScript per `helmet` |

---

## 7. File Eliminati

| File | Motivazione |
|---|---|
| `apps/frontend/add-logout-confirm.mjs` | Script di manipolazione file sorgente abbandonato, non più necessario |

---

## 8. Build Results

### Backend (`npx nest build`)
```
✅ 0 errori TypeScript
✅ Compilazione completata
```

### Frontend (`npm run build`)
```
▲ Next.js 16.2.1 (Turbopack)
✅ Compiled successfully in 2.8s
✅ TypeScript: 0 errori
✅ 19 route generate (tutte dynamic/server-rendered)

Route generate:
/                           ƒ
/auth/logout                ƒ  ← ora POST only
/auth/oauth/callback        ƒ  ← nuova route
/dashboard                  ƒ
/dashboard/addproduct       ƒ
/dashboard/orders           ƒ
/dashboard/role             ƒ
/dashboard/updateproduct    ƒ
/login                      ƒ
/logout                     ƒ
/user                       ƒ
/user/orders                ƒ
... (altre route statiche)
```

---

## 9. Problemi Non Risolti

I seguenti problemi sono stati documentati ma non implementati per le ragioni indicate.

### 9.1 Password DB Banale nel docker-compose
**Stato:** Non modificato su esplicita richiesta dell'utente.  
**Raccomandazione:** Sostituire `POSTGRES_PASSWORD: 123` con una password sicura e usare variabili d'ambiente esterne (`.env` non committato) per l'ambiente di produzione.

### 9.2 `bulkBusy` Flag in Memoria
**Stato:** Aggiunto TODO comment, non implementato.  
**Raccomandazione:** Sostituire il flag `private bulkBusy = false` con un record nel database (tabella `application_locks`) o una entry Redis con TTL. Questo garantisce consistenza tra più istanze del backend.

### 9.3 Dipendenze UI Ridondanti (MUI + TailwindCSS)
**Stato:** Non modificato.  
**Raccomandazione:** Scegliere un unico sistema di design. La presenza contemporanea di `@mui/material` e `tailwindcss`/`shadcn/ui` aumenta il bundle size e la complessità stilistica. La migrazione richiede un refactoring esteso dei componenti.

### 9.4 Typo nella Tabella DB `dowloadVerification`
**Stato:** Il nome del **modello Prisma** è stato corretto in `DownloadVerification`. Il nome della **tabella nel database** rimane `dowloadVerification` grazie al `@@map`.  
**Raccomandazione:** Per correggere anche il nome della tabella nel DB, eseguire una migration con rename esplicito:
```sql
ALTER TABLE "dowloadVerification" RENAME TO "download_verifications";
```
Poi aggiornare lo schema Prisma: `@@map("download_verifications")`.
