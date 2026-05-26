# DEPLOYMENT_LOG.md

This document details the diagnostic steps, root causes, and fixes applied to resolve deployment errors and communication failures between the LinkShelf React frontend and Express/Prisma API.

---

## 1. What Failed?

During production deployment, the application faced three main issues:
1. **CORS Blockage**: The browser blocked any HTTP request to the API, throwing a CORS error:
   ```
   Access to fetch at 'https://linkshelf-api.onrender.com/api/auth/login' from origin 'https://linkshelf-frontend.onrender.com' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
   ```
2. **Undefined API Host**: The frontend attempted to hit `undefined/api/...` because `VITE_API_URL` was not injected at build time.
3. **Database Client Missing**: The backend crashed on database queries because the Prisma client generation step was omitted in the build stage.

---

## 2. Root Cause Analysis

| # | Issue Found | File(s) Affected | Why It Caused a Failure |
|---|---|---|---|
| 1 | Wildcard CORS Origin (`"*"`) | [index.js](file:///c:/Project-Engineering-main/Milestone%2008/lu-8.6-CORS-and-Build-Failures/src/index.js) | Since the application uses cookies/credentials (with `credentials: true`), browsers strictly prohibit using a wildcard (`*`) for the `Access-Control-Allow-Origin` header due to security reasons. |
| 2 | Undefined Frontend API Host | [render.yaml](file:///c:/Project-Engineering-main/Milestone%2008/lu-8.6-CORS-and-Build-Failures/render.yaml) | Vite resolves `import.meta.env.VITE_API_URL` at **build time**. Because it was not declared in the static site's environment variables in the blueprint, Vite compiled the bundle with `undefined`. |
| 3 | Missing Prisma Build Command | [render.yaml](file:///c:/Project-Engineering-main/Milestone%2008/lu-8.6-CORS-and-Build-Failures/render.yaml) | The build command was just `npm install`. It failed to run `npx prisma generate` to create the Prisma Client JS bundle inside the production environment, causing DB query failures. |

---

## 3. Fixes Applied

### Fix 1 — CORS Configuration:
- **Affected File**: [index.js](file:///c:/Project-Engineering-main/Milestone%2008/lu-8.6-CORS-and-Build-Failures/src/index.js)
- **Changes**: Updated CORS options to accept origin from `process.env.CORS_ORIGIN` and explicitly allowed `credentials: true`. Also added `CORS_ORIGIN` to the `validateEnv()` startup checks to prevent starting up misconfigured servers.

### Fix 2 — Frontend Build Environment:
- **Affected File**: [render.yaml](file:///c:/Project-Engineering-main/Milestone%2008/lu-8.6-CORS-and-Build-Failures/render.yaml)
- **Changes**: Added `VITE_API_URL` under the frontend service `envVars` with `sync: false` to request the user for the production API URL during blueprint setup. Added `CORS_ORIGIN` to backend `envVars` as well.

### Fix 3 — Build Command:
- **Affected File**: [render.yaml](file:///c:/Project-Engineering-main/Milestone%2008/lu-8.6-CORS-and-Build-Failures/render.yaml)
- **Changes**: Updated the backend `buildCommand` to `npm install && npx prisma generate && npx prisma migrate deploy` to compile the Prisma client before starting node.

---

## 4. Verification

- **Local Fail-Fast Validation (Without Environment File)**:
  ```bash
  > node src/index.js
  ❌ FATAL: Missing required environment variables: DATABASE_URL, JWT_SECRET, CORS_ORIGIN
  ```

- **Local Successful Startup Logs**:
  ```bash
  > node src/index.js
  ✅ All required environment variables are set.
  🚀 LinkShelf API running on port 3000
  ```

- **Preflight OPTIONS Request**:
  Succeeds with `200 OK` and returns headers allowing the frontend origin securely:
  - `Access-Control-Allow-Origin: http://localhost:5173`
  - `Access-Control-Allow-Credentials: true`

---

## 5. Key Takeaways

1. **Vite Variable Injection**: React/Vite builds embed environment variables (prefixed with `VITE_`) during the compilation/build phase. Node/Express services evaluate environment variables dynamically at runtime.
2. **CORS credentials constraints**: When configuring CORS for API routes handling credentials, wildcards `*` are forbidden by the browser security sandbox. A specific, environment-defined origin must be returned in the header.
