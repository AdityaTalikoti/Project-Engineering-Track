# Still In? – Bug Fix Log

Please document all the fixes you implemented below. For each fix, describe:
1. **The Problem**: What was going wrong?
2. **The Discovery**: How did you find it (e.g., Network Tab, console, code audit)?
3. **The Fix**: What code did you change and why?

---

## 🛠️ Your Fixes

### 1. Wrong HTTP Status on Token Expiry
- **Problem**: When a token expires (after 60 seconds), `jwt.verify` throws a `TokenExpiredError`. The backend's authentication middleware (`server/middleware/auth.js`) catches this in a generic try/catch block and returns status `500` with the message `"Invalid token"`. The frontend cannot differentiate between a server error and a session expiry.
- **Discovery**: Code audit of `server/middleware/auth.js` showed that all verification errors are returned as a generic 500 status.
- **Fix**: Modify `authMiddleware` to catch `TokenExpiredError` specifically and return a `401 Unauthorized` status with a clear error message (`"Token expired"`). Other verification errors will remain 500.

### 2. Voting Logic Allows Duplicate Votes
- **Problem**: The duplicate vote checking in `server/routes/poll.js` compares the stored user IDs with `req.user.email` (`votedUserIds.find(id => id === req.user.email)`). Since `votedUserIds` stores numeric IDs (`req.user.id`) and `req.user.email` is a string containing the user's email, this comparison always evaluates to `false`. This allows users to cast duplicate votes infinitely.
- **Discovery**: Code audit of `server/routes/poll.js` and comparison of user registration/login data types.
- **Fix**: Change the duplicate vote check to use `votedUserIds.includes(req.user.id)`, which correctly checks if the numeric user ID is already present in the `votedUserIds` list.

### 3. Missing Global Axios Interceptor
- **Problem**: The frontend Axios client (`client/src/api/client.js`) has no global response interceptor. When an API call returns a `401 Unauthorized` error (e.g. when trying to vote with an expired token), the error is ignored by the global client, and the local storage credentials are not cleared, keeping the user logged in visually.
- **Discovery**: Audit of `client/src/api/client.js` and checking how individual API calls handle errors.
- **Fix**: Add an Axios response interceptor that listens for `401` errors, removes the token and user details from `localStorage`, and triggers a redirect to the login page.

### 4. Polling Interval Keeps Running After Expiry
- **Problem**: In `client/src/pages/Dashboard.jsx`, the poll results are fetched every 10 seconds via `setInterval`. When a session expires, the polling loop continues indefinitely, leading to a resource leak and constant failing API requests.
- **Discovery**: Code audit of `client/src/pages/Dashboard.jsx`.
- **Fix**: Integrate the Axios interceptor with the React `AuthContext` by registering a logout callback. When a `401` response occurs, the interceptor calls this callback, which updates React state, setting `user` to `null`. This unmounts the `Dashboard` component (due to `PrivateRoute`), which invokes the `useEffect` cleanup and runs `clearInterval` to stop the polling loop.

