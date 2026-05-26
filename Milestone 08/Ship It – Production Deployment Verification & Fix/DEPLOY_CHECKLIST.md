# FullShip — Deployment Checklist

## Bug Found
- **Type**: `Type B — CORS Issue (Backend)`
- **Location**: [server.js](file:///c:/Project-Engineering-main/Milestone%2008/Ship%20It%20%E2%80%93%20Production%20Deployment%20Verification%20&%20Fix/backend/src/server.js) at line 14
- **Before value**: `origin: 'http://localhost:5173'`
- **After value**: `origin: process.env.CORS_ORIGIN || 'http://localhost:5173'`
- **Fix confirmed by**: Browser Network tab returning 200 OK and fetching items list successfully on deployed frontend.

## Checklist
- [x] Frontend is live — Proof: https://fullship-frontend.vercel.app
- [x] Backend is live — Proof: `curl https://fullship-backend.onrender.com/health` -> `{"status":"ok"}`
- [x] API call works end-to-end — Proof: DevTools Network tab showing GET to `/api/items` returning 200 OK status
- [x] CI pipeline passes — Proof: GitHub Actions CI status green
- [x] Health check responds — Proof: HTTP status 200 OK

## Reflection
1. **What broke**: The backend was hardcoded to accept requests only from the local frontend origin (`http://localhost:5173`). This caused the browser's CORS security policy to block requests from the live production frontend URL.
2. **How identified**: Opened the deployed Vercel URL in Chrome DevTools and attempted to load items. Observed the CORS block error in the console and the status `0` preflight OPTIONS request in the Network tab.
3. **Prevention**: Establish a rule of thumb to never hardcode CORS domains. Implement environment-driven CORS configuration (`process.env.CORS_ORIGIN`) with localhost fallbacks on all backend services.
