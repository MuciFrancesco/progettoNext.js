# Enterprise Test Strategy Design

**Date:** 2026-05-04

**Goal**

Definire una strategia di test "alta ma pragmatica" per `progettoNext.js` che copra in modo affidabile i flussi critici di business e sicurezza, senza gonfiare la suite con test fragili o ridondanti.

**Current Context**

- Il frontend usa Next.js App Router con componenti server/client, i18n, route protette e feature admin/user distinte.
- Il backend usa NestJS, Prisma, JWT, refresh rotation, lockout login e controller admin/auth con percorsi sensibili.
- La base attuale include:
  - unit test frontend con Vitest, ancora iniziali ma già ben impostati sui hook admin e i18n
  - unit test backend con Jest sui service principali
  - backend e2e con Jest + Supertest
  - frontend e2e con Playwright e scenari Gherkin in `apps/frontend/e2e/**`
- `TEST_STRATEGY.md` è utile come storico, ma va riallineato alla struttura reale e alla copertura che oggi vogliamo costruire.
- Graphify evidenzia come nodi più centrali `getTranslator()`, `createTranslator()`, `getCurrentLocale()`, `authenticatedBackendRequest()`, `AuthService`, `AdminController`, `AdminService`, `requireAdminOrEmployeeSession()`.

## Recommended Testing Architecture

Adottiamo una piramide di test moderna, orientata al rischio:

1. **Unit tests come prima linea di difesa**
   - rapidi, deterministici, economici
   - concentrati su hook, helper, policy, guard, service e trasformazioni di stato
2. **Backend e2e contract tests come seconda linea**
   - validano i contratti API reali, autorizzazione, validazione input e regressioni cross-module
3. **Frontend Playwright/Gherkin come terza linea**
   - coprono solo i flussi utente ad alto valore che attraversano UI, sessione, backend e redirect

Non inseguiamo la copertura totale di ogni file. In un progetto enterprise moderno conta di più chiudere i punti di rottura reali: auth, permessi, mutazioni admin, locale, catalogo, checkout, redirect e stati di sessione.

## Scope by Layer

### 1. Frontend Unit Tests

**Target**

- hook con stato e orchestrazione:
  - `useAdminRoleManager`
  - `useAdminUpdateProductsTable`
  - `useAdminOrders`
  - `useMyOrders`
  - `useProductCatalog`
  - hook auth/session/cart/checkout dove c'è logica decisionale
- helper puri:
  - i18n locale/translation
  - formatting
  - route/policy helpers
  - validazioni form dove isolate
- componenti solo se contengono comportamento critico o branching non banale

**Do not target heavily**

- componenti puramente presentazionali
- wrapper layout senza logica
- test duplicati di markup statico

**Success criteria**

- ogni hook critico ha test su happy path, error path e almeno un edge case di stato
- ogni helper di sicurezza o trasformazione usato in più punti ha coverage diretta
- i refactor futuri dell'area admin e shop possono contare su regressions veloci

### 2. Backend Unit Tests

**Target**

- `AuthService`
  - signin/signup
  - lockout and login attempts
  - refresh token rotation and reuse detection
  - logout / invalidazione sessione
- `AdminService`
  - bulk update/delete
  - duplicate product logic
  - paging/filter/sort contracts
  - busy status abstraction
- nuove guard:
  - `AdminGuard`
  - `AdminOrEmployeeGuard`
- `MailerService`
  - fallback logging quando provider assente
  - provider path configurato
  - failure handling
- upload validation logic
  - file type / magic bytes behavior isolabile

**Success criteria**

- business rules e security rules sono testate senza boot completo dell'app
- ogni nuovo boundary introdotto negli ultimi refactor ha almeno una suite dedicata

### 3. Backend E2E Tests

**Target**

- auth
  - signup/signin
  - login failure escalation and block
  - reset password request contract
  - refresh / session semantics se endpoint disponibili
- access control
  - anonymous denied
  - standard user denied on admin-only routes
  - employee/admin matrix su route admin product-related
- users/profile
  - `PATCH /users/me/locale`
  - valid locale / invalid locale
- admin
  - list users
  - update role
  - product list / bulk status
  - upload endpoint spoof rejection

**Success criteria**

- i contratti API più critici sono difesi da test realistici
- la sicurezza autorizzativa non dipende solo da unit test

### 4. Frontend Playwright/Gherkin

**Target domains**

- `auth`
  - validation
  - lockout warning
  - signin/signup navigazione corretta
- `user`
  - accesso area utente
  - cambio locale
  - signout
  - access control verso admin
- `admin`
  - accesso dashboard
  - visibilità griglia base
  - cambio lingua
  - flussi admin critici essenziali
- `shop`
  - catalog rendering
  - add to cart
  - cart totals
  - accesso checkout
  - un happy path e un failure path principale sul checkout demo/payments dove fattibile

**Principles**

- Gherkin per flussi business leggibili
- page helpers sottili e orientati al dominio
- seed/login via API quando possibile
- locator solo stabili: `data-testid`, `aria-*`, stati DOM espliciti

**Success criteria**

- gli scenari Playwright rappresentano journey utente reali, non micro-verifiche tecniche
- ogni dominio ha pochi scenari forti, non decine di casi deboli

## Directory and Path Normalization

La struttura reale attuale dei Playwright test è `apps/frontend/e2e/<domain>/**` con support in `apps/frontend/e2e/utils/support/**`.

Propongo di normalizzare così:

- `apps/frontend/e2e/auth/*`
- `apps/frontend/e2e/user/*`
- `apps/frontend/e2e/admin/*`
- `apps/frontend/e2e/shop/*`
- `apps/frontend/e2e/utils/support/*`

e di riallineare `TEST_STRATEGY.md` a questi path reali.

Non forziamo un grosso rename se il layout attuale è già coerente; cambiamo i path solo dove migliorano chiarezza, naming e manutenzione. La regola è minimizzare churn non necessario.

## Coverage Priorities

### High Priority

- auth backend + frontend
- admin access control
- locale/session redirect behavior
- admin hooks con molto stato
- public catalog + user area flows
- upload/product bulk mutations

### Medium Priority

- checkout/cart flows
- cookie consent behavior
- error/loading boundary behavior
- public shop interactions non critiche

### Low Priority

- pagine statiche
- puro presentational rendering
- testi e micro-layout senza logica

## What We Intentionally Avoid

- snapshot test massivi
- test unit duplicati di componenti senza branching
- e2e ridondanti che ripetono lo stesso rischio già coperto meglio da unit/backend e2e
- copertura browser matrix prematura
- suite lente che richiedono setup fragile per casi a basso impatto

## Tooling and CI Direction

### Commands

- root:
  - `npm run test:unit`
- backend:
  - `npm test -w apps/backend`
  - `npm run test:e2e -w apps/backend`
- frontend:
  - `npm run test:unit -w apps/frontend`
  - `npm run test:e2e -w apps/frontend`
  - `npm run test:gherkin -w apps/frontend`

### CI Lanes

Separare in lane indipendenti:

- `frontend-unit`
- `backend-unit`
- `backend-e2e`
- `frontend-playwright`

Questo permette feedback più rapido e isolamento dei failure domain.

## Implementation Decomposition

Il lavoro va spezzato in sottoprogetti indipendenti:

1. **Testing strategy alignment**
   - riallineare docs, script, path, convenzioni
2. **Frontend unit expansion**
   - completare i hook e helper centrali
3. **Backend unit + e2e hardening**
   - estendere service/guard/mailer/upload e contratti API
4. **Frontend Playwright domain expansion**
   - auth, user, admin, poi shop/checkout
5. **CI/documentation finish**
   - script root, docs finali, commands stabili

Questa decomposizione è importante perché i livelli di test hanno costi e cicli di feedback diversi.

## Risks and Constraints

- alcune aree frontend hanno errori lint preesistenti che non vanno confusi con regressioni della nuova suite
- alcuni flussi e2e dipendono da backend, database e seed deterministico
- la verifica live del provider email richiederà variabili ambiente reali
- i test checkout potrebbero richiedere isolamento dalla parte più esterna del provider pagamento

## Final Recommendation

La strategia corretta per questo progetto è:

- **forte base unit**
- **backend e2e mirato per sicurezza e contratti**
- **frontend Playwright/Gherkin limitato ai journey che contano**

Questa è la combinazione che massimizza affidabilità e manutenibilità in un codebase enterprise moderno senza trasformare la suite in un collo di bottiglia.
