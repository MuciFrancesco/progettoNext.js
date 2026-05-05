# ARCHITECTURAL REFAC PLAN — Frontend Enterprise Audit
> Generato il: 2026-05-04 | Analisi: Graphify import-graph + Caveman static scan
> Branch target: `fix/tsk-0002-clear-all-project`

---

## Indice dei Violation Cluster

| # | Categoria | File Colpiti | Occorrenze | Priorità |
|---|-----------|-------------|------------|----------|
| A | Import illegale tra componenti | 9 cluster | 17 import | CRITICA |
| B | Zero-SX Policy (sx inline) | 19 file | 192 occorrenze | ALTA |
| C | Smart vs Dumb (logica in components/) | 9 file | 37 hook/fetch | ALTA |
| D | HTML nativo non sostituito da MUI | 9 file | 20 occorrenze | MEDIA |

---

## REGOLA 1 — Isolamento dei Componenti (Import Illegali)

> **Principio:** Un file in `components/<X>/` non può mai importare un altro componente da `components/<Y>/`.
> La composizione spetta solo a `features/` e alle `pages/`.

### Cluster A-01 — `Checkout/`
**Violazione:** `Checkout.tsx` compone `CardPaymentForm` (stesso folder)

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Checkout/Checkout.tsx:16-17` |
| **Criticità** | Import illegale tra componenti — `Checkout` compone `CardPaymentForm` |
| **Refactoring Action** | Creare `features/shop/components/CheckoutComposed.tsx` che importa entrambi `Checkout` e `CardPaymentForm` e li compone. Rimuovere l'import da `Checkout.tsx`. Aggiornare `CheckoutFeature.tsx` per puntare a `CheckoutComposed`. |

---

### Cluster A-02 — `CookieConsent/`
**Violazione:** `CookieConsentController.tsx` importa `CookieConsentBanner` (stesso folder)

| Campo | Valore |
|-------|--------|
| **File Path** | `components/CookieConsent/CookieConsentController.tsx:4` |
| **Criticità** | Import illegale — Controller compone Banner nello stesso folder |
| **Refactoring Action** | Spostare `CookieConsentController.tsx` in `features/cookie-consent/CookieConsentFeature.tsx`. Aggiornare tutti i consumer (solitamente `app/layout.tsx`). `CookieConsentBanner` rimane in `components/` come componente atomico puro. |

---

### Cluster A-03 — `DashboardHeader/`
**Violazione:** `DashboardHeader.tsx` importa `NavChip` e `NavDrawer` (stesso folder)

| Campo | Valore |
|-------|--------|
| **File Path** | `components/DashboardHeader/DashboardHeader.tsx:14-15` |
| **Criticità** | Import illegale — DashboardHeader è un aggregatore di sub-componenti nello stesso folder |
| **Refactoring Action** | Creare `features/admin/ui/dashboard-header/DashboardHeaderComposed.tsx` che compone `DashboardHeader`, `NavChip`, `NavDrawer`. Aggiornare `app/(admin)/dashboard/layout.tsx` per usare il nuovo file. I tre file atomici restano in `components/DashboardHeader/`. |

---

### Cluster A-04 — `Footer/`
**Violazione:** `AppFooter.tsx` → `FooterSection` → `FooterLink` (chain di import illegali)

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Footer/AppFooter.tsx:5-6` e `components/Footer/FooterSection.tsx:3` |
| **Criticità** | Chain import illegale a 3 livelli — AppFooter compone FooterSection che compone FooterLink |
| **Refactoring Action** | Creare `features/layout/FooterFeature.tsx` che importa `AppFooter`, `FooterSection`, `FooterLink` e li compone. `AppFooter` diventa un componente puro che accetta `sections: FooterSectionItem[]` come prop flat. Rimuovere gli import interni tra i tre file. |

---

### Cluster A-05 — `OrdersTable/`
**Violazione:** `OrdersTable.tsx` importa `OrdersTableHead` e `OrdersTableBody` (stesso folder)

| Campo | Valore |
|-------|--------|
| **File Path** | `components/OrdersTable/OrdersTable.tsx:30-31` |
| **Criticità** | Import illegale — OrdersTable è un aggregatore, non un componente atomico |
| **Refactoring Action** | Spostare `OrdersTable.tsx` (aggregatore) in `features/orders/ui/OrdersTableComposed.tsx`. `OrdersTableHead` e `OrdersTableBody` restano in `components/OrdersTable/` come atomici. Aggiornare `features/admin/components/AdminOrdersTable.tsx` e `features/user/components/MyOrdersTable.tsx`. |

---

### Cluster A-06 — `PrivacyPolicy/`
**Violazione:** `PrivacyPolicyContent.tsx` importa `PolicySection`, `PolicyHeader`, `PolicyBackLink` (stesso folder)

| Campo | Valore |
|-------|--------|
| **File Path** | `components/PrivacyPolicy/PrivacyPolicyContent.tsx:6-8` |
| **Criticità** | Import illegale — PrivacyPolicyContent è una composition page disguised da componente |
| **Refactoring Action** | `PrivacyPolicyContent.tsx` si fonde con `features/privacy/PrivacyFeature.tsx` (già esistente). I 4 sub-componenti (`PolicySection`, `PolicyHeader`, `PolicyBackLink`, `PolicyItemList`) restano atomici in `components/PrivacyPolicy/`. |

---

### Cluster A-07 — `ShopHeader/`
**Violazione:** `PublicShopHeader.tsx` → `PublicShopHeaderShell` → `PublicShopHeaderActions` (chain)

| Campo | Valore |
|-------|--------|
| **File Path** | `components/ShopHeader/PublicShopHeader.tsx:4` e `components/ShopHeader/PublicShopHeaderShell.tsx:10` |
| **Criticità** | Chain import illegale a 3 livelli nello stesso folder |
| **Refactoring Action** | Creare `features/layout/ShopHeaderFeature.tsx` che compone `PublicShopHeaderShell` e `PublicShopHeaderActions`. `PublicShopHeader.tsx` diventa un thin wrapper o viene rimosso. I 3 componenti atomici restano in `components/ShopHeader/`. |

---

## REGOLA 2 — Zero-SX Policy (192 violazioni)

> **Principio:** Ogni `sx={{...}}` deve essere convertito in una classe nel file `.module.scss` corrispondente.

### B-01 — `Cart/Cart.tsx` — 25 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Cart/Cart.tsx` |
| **Criticità** | 25 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare/aggiornare `Cart.module.scss`. Classi target: `.cartWrapper { display: flex; flex-direction: column; gap: 24px; }`, `.header`, `.emptyState`, `.grid`, `.productRow`, `.imageBox`, `.infoBox`, `.summaryPanel`. Sostituire ogni `sx={}` con `className={styles.*}`. |

---

### B-02 — `Checkout/CardPaymentForm.tsx` — 15 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Checkout/CardPaymentForm.tsx` |
| **Criticità** | 15 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `CardPaymentForm.module.scss`. Classi: `.formRoot`, `.savedCardRow`, `.cardRow`, `.cardIconOverlay`, `.expiryGrid`, `.submitButton`, `.securityRow`. |

---

### B-03 — `Checkout/Checkout.tsx` — 21 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Checkout/Checkout.tsx` |
| **Criticità** | 21 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `Checkout.module.scss`. Classi: `.checkoutPaper`, `.tabsBar`, `.tabItem`, `.paypalRow`, `.summaryPanel`, `.summaryItem`, `.totalRow`. |

---

### B-04 — `CookieConsent/CookieConsentBanner.tsx` — 12 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/CookieConsent/CookieConsentBanner.tsx` |
| **Criticità** | 12 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `CookieConsentBanner.module.scss`. Classi: `.banner`, `.title`, `.description`, `.toggleGroup`, `.toggleCaption`, `.divider`, `.actionRow`, `.actionButton`. |

---

### B-05 — `Contact/ContactContent.tsx` — 3 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Contact/ContactContent.tsx` |
| **Criticità** | 3 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `ContactContent.module.scss`. Classi: `.root`, `.grid`, `.ctaRow`. |

---

### B-06 — `DashboardHeader/DashboardHeader.tsx` — 8 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/DashboardHeader/DashboardHeader.tsx` |
| **Criticità** | 8 blocchi `sx={{}}` inline |
| **Refactoring Action** | Aggiornare `DashboardHeader.module.scss`. Classi aggiuntive: `.appBar`, `.toolbar`, `.logoBox`, `.logoSpan`, `.roleBadge`, `.navChipRow`, `.actionsBox`. |

---

### B-07 — `DashboardHeader/NavDrawer.tsx` — 6 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/DashboardHeader/NavDrawer.tsx` |
| **Criticità** | 6 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `NavDrawer.module.scss`. Classi: `.closeButton`, `.drawerHeader`, `.sectionLabel`, `.navList`, `.navItem`, `.navItemIcon`. |

---

### B-08 — `Footer/AppFooter.tsx` — 7 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Footer/AppFooter.tsx` |
| **Criticità** | 7 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `AppFooter.module.scss`. Classi: `.footer`, `.inner`, `.grid`, `.bottom`, `.brandName`, `.accent`. |

---

### B-09 — `Footer/FooterLink.tsx` — 2 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Footer/FooterLink.tsx` |
| **Criticità** | 2 blocchi `sx={{}}` inline (link interno ed esterno) |
| **Refactoring Action** | Creare `FooterLink.module.scss`. Classe unica: `.link { font-size: 0.875rem; color: var(--muted-foreground); &:hover { color: var(--foreground); } }`. Applicare a entrambi i rami condizionali. |

---

### B-10 — `Navbar/Navbar.tsx` — 3 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Navbar/Navbar.tsx` |
| **Criticità** | 3 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `Navbar.module.scss`. Classi: `.appBar`, `.chip`, `.toolbar`. |

---

### B-11 — `PanelsGrid/PanelsGrid.tsx` — 5 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/PanelsGrid/PanelsGrid.tsx` |
| **Criticità** | 5 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `PanelsGrid.module.scss`. Classi: `.paper`, `.headerCell`, `.bodyCell`, `.keyCell`, `.valueCell`. |

---

### B-12 — `OrdersTable/OrdersTable.tsx` — 3 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/OrdersTable/OrdersTable.tsx` |
| **Criticità** | 3 blocchi `sx={{}}` inline |
| **Refactoring Action** | Aggiornare `OrdersTable.module.scss`. Classi: `.title`, `.detailContainer`, `.detailTitle`. |

---

### B-13 — `OrdersTable/OrdersTableBody.tsx` — 7 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/OrdersTable/OrdersTableBody.tsx` |
| **Criticità** | 7 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `OrdersTableBody.module.scss`. Classi: `.emptyCell`, `.row`, `.idCell`, `.nameCell`, `.dateCell`, `.priceCell`, `.statusChip`. |

---

### B-14 — `OrdersTable/OrdersTableHead.tsx` — 2 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/OrdersTable/OrdersTableHead.tsx` |
| **Criticità** | 2 blocchi `sx={{}}` inline (responsive hidden columns) |
| **Refactoring Action** | Creare `OrdersTableHead.module.scss`. Classi responsive: `.hiddenMd { display: none; @media (min-width: 900px) { display: table-cell; } }`, `.hiddenSm { display: none; @media (min-width: 600px) { display: table-cell; } }`. |

---

### B-15 — `ProductCatalog/ProductCatalog.tsx` — 15 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/ProductCatalog/ProductCatalog.tsx` |
| **Criticità** | 15 blocchi `sx={{}}` inline |
| **Refactoring Action** | Aggiornare `ProductCatalog.module.scss`. Classi aggiuntive: `.overline`, `.heroTitle`, `.heroSubtitle`, `.filterSelect`, `.chipRow`, `.emptyState`, `.grid`, `.card`, `.imageBox`, `.contentBox`, `.titleRow`, `.priceRow`, `.priceLabel`, `.unitLabel`. |

---

### B-16 — `PrivacyPolicy/PrivacyPolicyContent.tsx` — 32 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/PrivacyPolicy/PrivacyPolicyContent.tsx` |
| **Criticità** | 32 blocchi `sx={{}}` — file con più violazioni SX assolute |
| **Refactoring Action** | Creare `PrivacyPolicyContent.module.scss`. Classi sistematiche: `.root`, `.sectionStack`, `.bodyText`, `.bulletList`, `.bulletItem`. Ogni `ListItem sx={{ display: 'list-item' }}` → `<ListItem className={styles.bulletItem}>`. |

---

### B-17 — `ShopHeader/PublicShopHeaderActions.tsx` — 3 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/ShopHeader/PublicShopHeaderActions.tsx` |
| **Criticità** | 3 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `PublicShopHeaderActions.module.scss`. Classi: `.actionsRow`, `.iconButton`, `.badge`. |

---

### B-18 — `ShopHeader/PublicShopHeaderShell.tsx` — 6 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/ShopHeader/PublicShopHeaderShell.tsx` |
| **Criticità** | 6 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `PublicShopHeaderShell.module.scss`. Classi: `.appBar`, `.toolbar`, `.logoLink`, `.logoText`, `.spacer`, `.actionsSlot`. |

---

### B-19 — `TermsOfService/TermsOfServiceContent.tsx` — 17 violazioni SX

| Campo | Valore |
|-------|--------|
| **File Path** | `components/TermsOfService/TermsOfServiceContent.tsx` |
| **Criticità** | 17 blocchi `sx={{}}` inline |
| **Refactoring Action** | Creare `TermsOfServiceContent.module.scss`. Schema identico a PrivacyPolicyContent: `.root`, `.sectionStack`, `.bodyText`, `.bulletList`, `.bulletItem`. |

---

## REGOLA 3 — Smart vs Dumb: Componenti con Logica in `components/`

> **Principio:** `components/` deve contenere solo componenti presentazionali. Logica, stato, effetti e fetch vanno in `features/`.

### C-01 — `Checkout/CardPaymentForm.tsx` — SMART
**8 useState (cardNumber, expiry, cvc, name, wantSave, saved, useSaved, errors)**

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Checkout/CardPaymentForm.tsx:173-180` |
| **Criticità** | ALTA — 8 stati + validazione + logica localStorage in un componente presentazionale |
| **Refactoring Action** | Estrarre logica in `features/shop/hooks/useCardPaymentForm.ts` (hook puro). `CardPaymentForm` diventa controllato: riceve `formState` e `handlers` come props. |

---

### C-02 — `CookieConsent/CookieConsentController.tsx` — SMART
**4 useState (visible, showDetails, analytics, marketing)**

| Campo | Valore |
|-------|--------|
| **File Path** | `components/CookieConsent/CookieConsentController.tsx:44-47` |
| **Criticità** | ALTA — Il nome "Controller" tradisce la natura: appartiene a `features/` |
| **Refactoring Action** | Spostare in `features/cookie-consent/CookieConsentFeature.tsx`. Estrarre stato in `features/cookie-consent/hooks/useCookieConsent.ts`. |

---

### C-03 — `ErrorState/AppErrorState.tsx` — SMART
**useState + useEffect (lettura cookie locale)**

| Campo | Valore |
|-------|--------|
| **File Path** | `components/ErrorState/AppErrorState.tsx:40-42` |
| **Criticità** | ALTA — useEffect con side-effect in un componente presentazionale |
| **Refactoring Action** | Estrarre in `hooks/useLocaleFromCookie.ts`. `AppErrorState` riceve `locale: Locale` come prop. |

---

### C-04 — `ForgotPasswordForm/ForgotPasswordForm.tsx` — SMART
**4 useState (email, emailError, submitted, loading)**

| Campo | Valore |
|-------|--------|
| **File Path** | `components/ForgotPasswordForm/ForgotPasswordForm.tsx:26-29` |
| **Criticità** | ALTA — Logica form + server action in components/ |
| **Refactoring Action** | Spostare in `features/auth/ui/ForgotPasswordFormContainer.tsx`. Estrarre stato in `features/auth/hooks/useForgotPassword.ts`. `ForgotPasswordForm` diventa dumb con props. |

---

### C-05 — `DashboardHeader/NavDrawer.tsx` — SMART (eccezione deliberata)
**useState (drawer open/close)**

| Campo | Valore |
|-------|--------|
| **File Path** | `components/DashboardHeader/NavDrawer.tsx:24` |
| **Criticità** | BASSA — Stato UI locale (open/close) accettabile in un componente atomico |
| **Refactoring Action** | Mantenere lo `useState` interno. Documentare con commento `// UI-local state: acceptable in atomic components`. Nessuna migrazione richiesta. |

---

### C-06 — `DashboardHeader/LogoutButton.tsx` — SMART
**useState + useTransition**

| Campo | Valore |
|-------|--------|
| **File Path** | `components/DashboardHeader/LogoutButton.tsx:22` |
| **Criticità** | ALTA — Logica di logout (confirm dialog + transition) in components/ |
| **Refactoring Action** | Spostare in `features/LogOut/LogOutFeature.tsx` (già esiste). Aggiornare `DashboardHeader` per importare dal layer features. |

---

### C-07 — `ResetPasswordForm/ResetPasswordForm.tsx` — SMART
**4 useState (password, success, loading, error)**

| Campo | Valore |
|-------|--------|
| **File Path** | `components/ResetPasswordForm/ResetPasswordForm.tsx:24-27` |
| **Criticità** | ALTA — Form + server action in components/ |
| **Refactoring Action** | Estrarre in `features/auth/hooks/useResetPassword.ts`. Componente dumb riceve `state` + `onSubmit` da `features/auth/ui/ResetPasswordContainer.tsx`. |

---

### C-08 — `SessionExpiryWatcher/SessionExpiryWatcher.tsx` — SMART (CRITICO)
**useEffect + 2 fetch() (session polling + logout HTTP)**

| Campo | Valore |
|-------|--------|
| **File Path** | `components/SessionExpiryWatcher/SessionExpiryWatcher.tsx:21,34,49` |
| **Criticità** | CRITICA — Polling di rete e logout HTTP direttamente in components/ |
| **Refactoring Action** | Spostare interamente in `features/auth/SessionExpiryFeature.tsx` + hook `hooks/useSessionExpiry.ts`. Il componente non deve contenere fetch. |

---

### C-09 — `utils/AutoRedirect.tsx` — SMART
**useEffect con router.push()**

| Campo | Valore |
|-------|--------|
| **File Path** | `components/utils/AutoRedirect.tsx:11` |
| **Criticità** | MEDIA — Side effect di navigazione in un componente utility |
| **Refactoring Action** | Trasformare in hook puro `hooks/useAutoRedirect.ts` consumato dalle pages, oppure spostare in `features/utils/AutoRedirectFeature.tsx`. |

---

## REGOLA 4 — Audit MUI: HTML Nativo Residuo

> **Principio:** `p`, `div`, `span`, `button`, `h1-h6` vanno sostituiti con `Typography`, `Box`, `Stack`, `Button`.

### D-01 — `GlobalPageLoading/GlobalPageLoading.tsx` — 4 tag nativi

| Campo | Valore |
|-------|--------|
| **File Path** | `components/GlobalPageLoading/GlobalPageLoading.tsx` |
| **Criticità** | MEDIA |
| **Refactoring Action** | `<div>` → `<Box>`, `<span>` → `<Box component="span">`. |

---

### D-02 — `ForgotPasswordForm/ForgotPasswordForm.tsx` — 3 tag nativi

| Campo | Valore |
|-------|--------|
| **File Path** | `components/ForgotPasswordForm/ForgotPasswordForm.tsx` |
| **Criticità** | MEDIA |
| **Refactoring Action** | `<form>` → `<Box component="form">`, `<p>` → `<Typography>`, `<button>` → `<Button>`. |

---

### D-03 — `LocaleSwitcher/LocaleSwitcher.tsx` — 1 tag nativo

| Campo | Valore |
|-------|--------|
| **File Path** | `components/LocaleSwitcher/LocaleSwitcher.tsx` |
| **Criticità** | BASSA |
| **Refactoring Action** | Sostituire tag nativo residuo con MUI equivalente. |

---

### D-04 — `LogOut/LogOut.tsx` — 2 tag nativi

| Campo | Valore |
|-------|--------|
| **File Path** | `components/LogOut/LogOut.tsx` |
| **Criticità** | BASSA |
| **Refactoring Action** | `<div>` → `<Box>`, `<button>` → `<Button>`. |

---

### D-05 — `ResetPasswordForm/ResetPasswordForm.tsx` — 1 tag nativo

| Campo | Valore |
|-------|--------|
| **File Path** | `components/ResetPasswordForm/ResetPasswordForm.tsx` |
| **Criticità** | BASSA |
| **Refactoring Action** | `<form>` → `<Box component="form">`. |

---

### D-06 — `PrivacyPolicy/PolicyItemList.tsx` — 1 tag nativo

| Campo | Valore |
|-------|--------|
| **File Path** | `components/PrivacyPolicy/PolicyItemList.tsx` |
| **Criticità** | BASSA |
| **Refactoring Action** | `<ul>/<li>` → `<List>/<ListItem>` MUI. |

---

### D-07 — `SigninFormCard/SigninFormCard.tsx` — 2 tag nativi

| Campo | Valore |
|-------|--------|
| **File Path** | `components/SigninFormCard/SigninFormCard.tsx` |
| **Criticità** | MEDIA — Form auth pubblicamente visibile |
| **Refactoring Action** | `<form>` → `<Box component="form">`, `<a>` → `<Link>` Next.js o MUI. |

---

### D-08 — `SignupFormCard/SignupFormCard.tsx` — 5 tag nativi

| Campo | Valore |
|-------|--------|
| **File Path** | `components/SignupFormCard/SignupFormCard.tsx` |
| **Criticità** | MEDIA — File con più violazioni HTML (5 tag) |
| **Refactoring Action** | `<form>` → `<Box component="form">`, `<p>` → `<Typography>`, `<a>` → `<Link>`, `<button>` → `<Button>`. |

---

### D-09 — `Checkout/Checkout.tsx` — 1 tag nativo

| Campo | Valore |
|-------|--------|
| **File Path** | `components/Checkout/Checkout.tsx` |
| **Criticità** | BASSA |
| **Refactoring Action** | Verificare wrapper nativo residuo e sostituire con `<Box>`. |

---

## Piano di Esecuzione — Ordine Priorità

```
SPRINT 1 — Blockers critici
  [C-08] SessionExpiryWatcher → features/auth/  (fetch in components/ — CRITICO)
  [C-06] LogoutButton → features/LogOut/         (transition + dialog in components/)
  [A-05] OrdersTable split → features/orders/    (aggregatore più usato a runtime)
  [A-03] DashboardHeader split → features/admin/ (layout admin dipende da esso)

SPRINT 2 — Zero-SX file ad alto impatto
  [B-16] PrivacyPolicyContent.tsx  → 32 SX
  [B-03] Checkout.tsx              → 21 SX
  [B-01] Cart.tsx                  → 25 SX
  [B-15] ProductCatalog.tsx        → 15 SX
  [B-02] CardPaymentForm.tsx       → 15 SX

SPRINT 3 — Zero-SX file secondari
  [B-04] CookieConsentBanner       → 12 SX
  [B-19] TermsOfServiceContent     → 17 SX
  [B-06] DashboardHeader           →  8 SX
  [B-07] NavDrawer                 →  6 SX
  [B-13] OrdersTableBody           →  7 SX
  [B-08] AppFooter                 →  7 SX
  [B-18] PublicShopHeaderShell     →  6 SX

SPRINT 4 — Smart → Dumb migration
  [C-01] CardPaymentForm → useCardPaymentForm hook
  [C-04] ForgotPasswordForm → features/auth/
  [C-07] ResetPasswordForm → features/auth/
  [C-03] AppErrorState → useLocaleFromCookie hook
  [C-02] CookieConsentController → features/cookie-consent/
  [C-09] AutoRedirect → hooks/useAutoRedirect

SPRINT 5 — Import illegali rimanenti + HTML nativo
  [A-01] Checkout / CheckoutComposed
  [A-02] CookieConsentController
  [A-04] Footer chain
  [A-06] PrivacyPolicyContent merge con PrivacyFeature
  [A-07] ShopHeader chain
  [D-08] SignupFormCard (5 tag — massima priorità HTML)
  [D-07] SigninFormCard, [D-02] ForgotPasswordForm
  [D-01] GlobalPageLoading, [D-04] LogOut, [D-06] PolicyItemList
```

---

## Riepilogo Quantitativo

| Categoria | File Impattati | Azioni Richieste |
|-----------|---------------|-----------------|
| Import illegali | 7 cluster (16 file coinvolti) | 7 migration/split task |
| Zero-SX | 19 file | 192 sx → ~85 classi SCSS nuove |
| Smart→Dumb | 9 file | 7 hook extraction + 5 spostamenti in features/ |
| HTML nativo | 9 file | 20 tag da sostituire con MUI |
| **TOTALE** | **~40 file** | **~119 micro-task atomici** |
