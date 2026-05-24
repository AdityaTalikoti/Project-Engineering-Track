# Project Changes & Fixes Log (Student Name: ________)

## 📋 Security Challenge Summary
This file **MUST** be updated as you progress through the fragments challenge. For each vulnerability identified and fixed, provide a detailed description of the problem and your solution.

---

### Vulnerability 1: Hardcoded JWT Secret & No Expiry
- **Found in**: `server/auth/jwt.js`
- **Description of the Problem**: The JWT secret (`fragments-secret-key`) was hardcoded directly in the source code as a string literal, which exposes it to anyone with repository access. Additionally, the token signing did not set an `expiresIn` property, meaning issued tokens never expire.
- **Description of the Fix**: Moved the JWT secret to an environment variable (`process.env.JWT_SECRET`) and added check logic so the server exits immediately if it is missing. Added an expiration config (`1h` by default) to token signing.

---

### Vulnerability 2: Role Missing from JWT Payload
- **Found in**: `server/routes/auth.js`
- **Description of the Problem**: The login and signup endpoints signed tokens with only the `userId` in the payload, omitting the user's role. This prevented the backend middleware from checking permissions dynamically from the token.
- **Description of the Fix**: Included the user's role in the JWT payload when signing the token (`signToken({ userId: user.id, role: user.role })`) and updated the auth middleware to attach the role to `req.user`.

---

### Vulnerability 3: Frontend Stores Role in localStorage
- **Found in**: `client/src/context/AuthContext.jsx`
- **Description of the Problem**: The user's role was stored in `localStorage` and read directly into state. This allows an attacker to change their role value in browser DevTools to visually unlock buttons in the UI.
- **Description of the Fix**: Removed the role from `localStorage`. Instead, the role is dynamically decoded from the JWT payload in the frontend context and exposed via `role: user?.role`.

---

### Vulnerability 4: Missing Role Checks on Critical Endpoints
- **Found in**: `server/routes/fragments.js`
- **Description of the Problem**: The critical endpoints for creating, editing, approving, and deleting fragments had no role checks (only basic auth). Any logged-in user, even a Reader, could perform all actions. Also, there was no check verifying that Contributors can only edit their own fragments.
- **Description of the Fix**: Enforced role checks using `roleCheck` middleware: POST fragments (Contributor+), PUT fragments (Contributor+), POST approve (Curator+), and DELETE fragments (Admin-only). Added ownership checks to ensure Contributors can only edit their own fragments.

---

### Vulnerability 5: CSRF Vulnerability
- **Found in**: `server/index.js`
- **Description of the Problem**: CORS was set to allow any origin (`*`), and there was no CSRF protection on state-changing requests (POST, PUT, DELETE), exposing users to cross-site request forgery attacks.
- **Description of the Fix**: Restricted CORS to `http://localhost:5173` with `credentials: true`. Implemented a double-submit cookie pattern where a random CSRF token is set in a cookie and validated against a custom header (`x-csrf-token`) on all state-changing requests.

---

### Vulnerability 6: Logout Does Not Invalidate Token
- **Found in**: `client/src/components/LogoutButton.jsx` & `server/middleware/auth.js`
- **Description of the Problem**: Logging out only cleared local storage credentials, leaving the JWT token active and valid until expiration. An attacker who hijacked the token could still use it to call API endpoints even after the user logged out.
- **Description of the Fix**: Implemented a server-side token blacklist. On logout, the client sends a POST request to `/api/auth/logout`, which adds the token to the blacklist. The auth middleware now rejects requests with blacklisted tokens.

---
> [!NOTE]
> Ensure that all fixes are tested in isolation using an API client (like Postman or curl) to confirm that unauthorized requests are rejected even if they bypass the frontend UI.
