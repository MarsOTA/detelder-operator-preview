# Detelder Operator Preview

Sandbox separata per la UI Operatore, derivata dalla branch OTA-DIGITAL/ezystaff_fe `branch-ottimizzazione-interfaccia-operatore`.

## Scopo

- vedere online gli stili Operatore senza installare Node sul Mac;
- usare dati reali tramite un proxy Vercel;
- modificare principalmente `src/pages/common/styleOperatori.css`;
- non toccare `MarsOTA/detelder-fe`;
- non eseguire Check-in, approvazioni o modifiche sul database dalla preview.

## Deploy Vercel

Importare questo repository pubblico su Vercel come progetto Vite.

Variabile ambiente opzionale:

`BACKEND_URL`

Se non specificata, il proxy usa il backend storico `http://51.91.59.187:3501/`. Se il backend Detelder cambia indirizzo, impostare `BACKEND_URL` nelle Environment Variables di Vercel e fare Redeploy.

## File UI principale

`src/pages/common/styleOperatori.css`

Il file è stato copiato dalla branch ufficiale del dev al momento della creazione della sandbox.
