# Deployment Checklist

**Application:** LaunchPad
**Platform:** Render
**Live URL:** https://launchpad-app.onrender.com
**Checklist completed:** 2026-05-26
**Engineer:** Aditya Talikoti

---

| # | Item | Status | Evidence |
|---|------|--------|----------|
| 01 | Env variables configured on platform | ✅ PASS | screenshots/01-env-vars-platform.png |
| 02 | Build passes locally | ✅ PASS | screenshots/02-local-build.png |
| 03 | Build passes in CI | ✅ PASS | screenshots/03-ci-build.png |
| 04 | DB migrations executed | ✅ PASS | screenshots/04-migration-log.png |
| 05 | CORS verified | ✅ PASS | screenshots/05-cors-network-tab.png |
| 06 | API base URL correct in production | ✅ PASS | screenshots/06-api-url.png |
| 07 | Auth flow tested in production | ✅ PASS | screenshots/07-auth-production.png |
| 08 | Health endpoint responding | ✅ PASS | `curl -s https://launchpad-app.onrender.com/health` returns `{"status":"ok","timestamp":"2026-05-26T08:50:00.000Z"}` |
| 09 | No secrets in Git | ✅ PASS | screenshots/09-no-secrets-git.png |
| 10 | .env.example committed | ✅ PASS | screenshots/10-env-example.png |
| 11 | Node version pinned | ✅ PASS | screenshots/11-node-version.png |
| 12 | Docker image builds locally | ⏭️ SKIP | Not using Docker. Deployed directly from GitHub to Render. Platform manages the Node.js environment. |

---

## Follow-up Tasks

- [x] Item 05 FAIL: Update CORS_ORIGIN on Render to match production frontend URL. (Resolved by setting correct CORS headers in Express).
- [x] Item 08 FAIL: Add GET /health endpoint to Express server before next deploy. (Resolved by implementing route in `backend/index.js`).
- [x] Item 11 FAIL: Backend Node version was unpinned. (Resolved by adding `engines` field in `backend/package.json`).

---

## Skip Justifications

- Item 12: Not using Docker. Deployed directly from GitHub to Render. Platform manages the Node.js environment.
