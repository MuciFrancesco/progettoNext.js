# Security Audit Log

## 2026-04-01

### Scope analizzato

- Monorepo completo con priorita backend NestJS/Prisma.
- Verifiche eseguite su auth, user, bookmark, strategy JWT, DTO e query DB.

### Vulnerabilita confermate

| Tipo di Vulnerabilita                  | Gravita  | File e Linea                                                                         | Descrizione                                                                                                                                                                                      | Fix Suggerito                                                                                                                                                                                                     |
| -------------------------------------- | -------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mass Assignment / Privilege Escalation | Critical | apps/backend/src/auth/dto/signup.dto.ts:45; apps/backend/src/auth/auth.service.ts:42 | Il campo sensibile isAdmin e accettato dal payload di signup e viene scritto direttamente in DB. Un utente non autenticato puo registrarsi con isAdmin=true e ottenere privilegi amministrativi. | Rimuovere isAdmin dal DTO pubblico di signup e forzare isAdmin=false lato service. Snippet consigliato: in SignupDto eliminare la proprieta isAdmin; in auth.service.ts usare `isAdmin: false` nel create utente. |

### Rischi Potenziali

- OAuth callback: non emerge bypass evidente dal codice analizzato, ma la robustezza dipende anche dalla configurazione Passport/provider (state, callback URL, secret reali in ambiente).
- Brute-force lockout su email: design attuale puo consentire denial mirato su account noti (blocco temporaneo tramite tentativi falliti), anche se mitigato da throttling globale.

### Assunzioni e Limiti dell'analisi

- Analisi statica sul codice presente nel workspace al 2026-04-01.
- Non sono stati eseguiti test dinamici di exploit end-to-end contro endpoint runtime.
- File generati in dist non sono stati considerati fonte primaria rispetto ai sorgenti in src.

### Stato complessivo backend

- Stato: At Risk.
- Motivazione: presente una vulnerabilita Critical confermata (escalation privilegi in signup).
- Priorita operativa: correggere immediatamente il flusso signup e rieseguire audit/auth regression test.

### Prossimi step consigliati

1. Applicare fix mass assignment su signup (DTO + service) e aggiungere test e2e che verifichi impossibilita di creare admin via API pubblica.
2. Introdurre test di autorizzazione per endpoint sensibili (users, bookmarks) con casi owner/non-owner.
3. Aggiungere check CI di sicurezza (lint regole per campi sensibili nei DTO pubblici e scansione query raw Prisma).
