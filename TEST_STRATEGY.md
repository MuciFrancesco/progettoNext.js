# TEST STRATEGY

## Data ultimo aggiornamento

- 2026-04-01

## Architettura della suite e principi adottati

- Backend unit test con Jest su service critici, mockando dipendenze esterne (Prisma, JWT, Mailer, Argon2).
- Backend e2e con Jest + Supertest su controller reali e database di test, con focus su autenticazione, lockout e autorizzazione.
- Frontend e2e con Playwright e scenari comportamentali in stile Gherkin:
  - file `.feature` in `apps/frontend/e2e/features`
  - step definitions in `apps/frontend/e2e/specs`
- Frontend e2e organizzato per dominio con support shared in `apps/frontend/e2e/support`:
  - `pages/` per page helpers leggeri e riutilizzabili
  - `auth-api.ts` per seed/login deterministico via backend
  - `auth-test-ids.ts` come contratto unico dei selettori stabili
- Tutti i locator Playwright usano `data-testid` o stati espliciti del DOM (`data-validation-state`, `aria-invalid`) invece del testo visibile.
- Casi test prioritizzati per rischio:
  - autenticazione, brute force, accessi non autorizzati, regressioni su permessi admin.
- Test data deterministico:
  - email univoche per run (`Date.now()`)
  - cleanup dati di test su teardown dove possibile.

## File test generati/aggiornati

### Backend

- `apps/backend/src/auth/auth.service.spec.ts`
- `apps/backend/test/e2e/auth.e2e-spec.ts`
- `apps/backend/test/e2e/access-control.e2e-spec.ts`

### Frontend

- `apps/frontend/e2e/features/auth.feature`
- `apps/frontend/e2e/features/user.feature`
- `apps/frontend/e2e/specs/auth.steps.ts`
- `apps/frontend/e2e/specs/auth.gherkin.spec.ts`
- `apps/frontend/e2e/specs/user.steps.ts`
- `apps/frontend/e2e/specs/user.gherkin.spec.ts`
- `apps/frontend/e2e/specs/admin.gherkin.spec.ts`
- `apps/frontend/e2e/support/auth-api.ts`
- `apps/frontend/e2e/support/auth-test-ids.ts`
- `apps/frontend/e2e/support/pages/auth-page.ts`
- `apps/frontend/e2e/support/pages/user-page.ts`
- `apps/frontend/e2e/support/pages/admin-page.ts`
- `apps/frontend/playwright.config.ts`

## Comandi npm (locale e CI)

Prerequisiti:

- database backend disponibile
- variabili env backend/frontend configurate

Comandi backend:

- `npm run test -w apps/backend`
- `npm run test:e2e -w apps/backend`
- `npm run test:cov -w apps/backend`

Comandi frontend:

- `npm run test:e2e -w apps/frontend`
- `npm run test:gherkin -w apps/frontend`

Comandi root utili:

- `npm run db:dev:up`
- `npm run backend:dev`
- `npm run frontend:dev`

## Copertura funzionale stimata

| Area    | Copertura Stimata | Evidenze                                                                                       |
| ------- | ----------------: | ---------------------------------------------------------------------------------------------- |
| Auth    |               80% | Signup/signin happy path, tentativi falliti, blocco account, validazione password weak lato UI |
| Profile |               75% | Accesso user area, cambio locale via server action, signout e redirect validati end-to-end     |
| Admin   |               80% | Redirect anonimo, deny per user standard, rendering dashboard e griglia utenti per admin       |

## Blind spot residui (prioritizzati)

| Priorita | Blind spot                                                                                     | Impatto                                                        |
| -------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| High     | Signout non coperto con test e2e backend (non esiste endpoint dedicato, solo server action FE) | Possibili regressioni UX/sessione non rilevate automaticamente |
| High     | Mancano e2e su `PATCH /users/me/locale` (input invalidi, locale edge-case)                     | Rischio regressioni i18n/profilo                               |
| Medium   | Mancano test controller bookmark end-to-end completi (CRUD + ownership cross-user)             | Rischio IDOR/regressioni autorizzative                         |
| Medium   | Manca copertura frontend completa sui provider OAuth esterni                                   | Rischio regressioni dei bottoni social non rilevate            |
| Medium   | Mancano failure path mailer (errore invio alert) e fallback osservabile                        | Rischio perdita segnalazioni sicurezza                         |
| Low      | Mancano test loading/error state granulari UI in rete lenta                                    | Qualita UX non pienamente validata                             |

## Prossimi step consigliati

- Aggiungere suite e2e per `users/me/locale` con validazione locale supportata/non supportata.
- Aggiungere e2e bookmark cross-user per coprire IDOR in modo esplicito.
- Estendere Playwright con coverage sui bottoni OAuth e sugli stati warning residui di signin.
- Introdurre pipeline CI separata: `backend-unit`, `backend-e2e`, `frontend-e2e` con report coverage.
