This is an English Vocabulary Builder application. It uses Vocab2026API as the backend service and SQL Server as the primary data store.

The application supports both manual vocabulary entry and automatic vocabulary extraction from input text. It integrates with Google Dictionary to retrieve word definitions and related linguistic data.

Currently, the system implements a dictation feature. Additional functionalities are planned for future releases.

## Local Configuration

Create these files from `.env.example`:

```env
# .env.development
VITE_API_BASE_URL=/api
```

```env
# .env.production
VITE_API_BASE_URL=/vocab2026API/api
```

Development uses `/api` so the Vite dev server can proxy API calls to IIS and avoid browser CORS issues. Production uses the IIS API virtual path directly.

The current Vite configuration is:

- Development frontend base path: `/`
- Production frontend base path: `/vocab2026/`
- Development API proxy: `/api/*` -> `http://localhost/vocab2026API/api/*`

Restart `npm run dev` after changing `.env.development`. Rebuild after changing `.env.production`.

## Development

Install dependencies:

```powershell
npm install
```

Run the Vite dev server:

```powershell
npm run dev
```

The dev server uses the proxy in `vite.config.js`, so frontend code can call `/api` while the real API remains hosted under IIS at `/vocab2026API/api`.

## IIS Deployment

The local IIS deployment uses these paths:

- Frontend URL: `http://localhost/vocab2026/`
- Frontend physical path: `C:\inetpub\wwwroot\vocab2026`
- API URL: `http://localhost/vocab2026API/api`
- API physical path: `C:\inetpub\wwwroot\vocab2026API`

Build the production frontend:

```powershell
npm run build
```

Copy the generated `dist` contents into the IIS frontend folder:

```powershell
New-Item -ItemType Directory -Force -Path C:\inetpub\wwwroot\vocab2026
Copy-Item -Path .\dist\* -Destination C:\inetpub\wwwroot\vocab2026 -Recurse -Force
```

If PowerShell reports access denied, run the copy command from an elevated PowerShell window.

## IIS Routing

`public/web.config` is copied into `dist` during the Vite build. It configures IIS to serve `index.html` for missing paths under `/vocab2026`, so direct navigation and browser refreshes work for React routes such as:

```text
http://localhost/vocab2026/list
```

This project uses an IIS `httpErrors` fallback instead of the IIS URL Rewrite module, so URL Rewrite is not required for the local deployment.

## Deployment Verification

After deployment, verify these URLs:

```text
http://localhost/vocab2026/
http://localhost/vocab2026/list
http://localhost/vocab2026API/api/Vocabularies/updated-dates
```

Expected result: all return HTTP 200. The first two should serve the React app, and the third should return JSON from the API.
