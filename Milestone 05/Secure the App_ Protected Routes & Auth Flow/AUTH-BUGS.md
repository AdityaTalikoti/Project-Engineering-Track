# VaultApp Authentication & Authorization Bug Analysis

This document details the observed broken behaviors and root cause analysis of the authentication issues in VaultApp.

---

## Observed Behaviours

Prior to applying any fixes, the following behaviors were observed when interacting with the application:

1. **Direct Navigation to Protected Pages without Logging In:**
   - **`/dashboard`:** Navigating directly to `/dashboard` renders the complete user dashboard component and all dashboard data, even though no authentication token is present.
   - **`/settings`:** Navigating directly to `/settings` renders the settings page and options without any login gate.
   - **`/profile`:** Navigating directly to `/profile` renders the profile page with user profile layout without any login restriction.
   
2. **Session Persistence (Refresh Behavior):**
   - Attempting to log in using the credentials (`demo@vault.app` / `password123`) results in a simulated "Auth system failure. Please check the implementation." error message.
   - Even if the auth context were loaded, refreshing the page resets the application state, causing the user to lose their logged-in session immediately because session details are not read from local storage upon initial mount.

3. **Navbar State & Logout Behavior:**
   - The navigation bar continuously displays the "Login" link and never shows the authenticated user's name or a "Logout" button, regardless of any simulation.
   - There is no option or button to log out.

---

## Root Cause Analysis

### Bug 1: Missing Context Provider
- **Location:** [main.jsx](file:///c:/Project-Engineering-main/Milestone%2005/Secure%20the%20App_%20Protected%20Routes%20&%20Auth%20Flow/src/main.jsx)
- **Description:** The `AuthProvider` component from `src/context/AuthContext` is imported but commented out and completely omitted from wrapping the React application hierarchy.
- **Impact:** Any component invoking the `useAuth()` custom hook (which queries `useContext(AuthContext)`) receives `null` as the context value. Consequently, trying to log in triggers the fallback error code branch: "Auth system failure. Please check the implementation."

### Bug 2: Missing Token & Session Persistence
- **Location:** [AuthContext.jsx](file:///c:/Project-Engineering-main/Milestone%2005/Secure%20the%20App_%20Protected%20Routes%20&%20Auth%20Flow/src/context/AuthContext.jsx)
- **Description:** 
  1. The `login` function in `AuthProvider` only updates React state variables (`user` and `token`) and does not write them to `localStorage` (i.e., `authToken` and `authUser`).
  2. The `logout` function only resets state to `null` and does not call `localStorage.removeItem()` to clean up stored credentials.
  3. There is no `useEffect` running on component mount to retrieve stored credentials from `localStorage` and initialize state.
- **Impact:** React state is transient. Refreshing the browser clears all memory, logging the user out. Additionally, login/logout events do not synchronize with the browser's storage mechanisms.

### Bug 3: Direct URL Access / Public Routes
- **Location:** [App.jsx](file:///c:/Project-Engineering-main/Milestone%2005/Secure%20the%20App_%20Protected%20Routes%20&%20Auth%20Flow/src/App.jsx)
- **Description:** The route elements for private components (`/dashboard`, `/settings`, `/profile`) are directly mapped to their respective element page components. There is no route guard or wrapper component (e.g., `ProtectedRoute`) checking if the user is authenticated before serving the component.
- **Impact:** Unauthenticated users can access private application routes by typing the path directly in the browser's address bar.

### Bug 4: Decoupled Navbar
- **Location:** [Navbar.jsx](file:///c:/Project-Engineering-main/Milestone%2005/Secure%20the%20App_%20Protected%20Routes%20&%20Auth%20Flow/src/components/Navbar.jsx)
- **Description:** The `Navbar` component does not reference or call the `useAuth` hook. The navigation links and login button are statically rendered without taking the authentication state into account.
- **Impact:** The Navbar is unable to toggle between logged-in and logged-out views (showing user email/name and Logout vs. Login links).

---

## Fixes Applied

### Fix 1: Wired Up Context Provider
- **Changes in:** [main.jsx](file:///c:/Project-Engineering-main/Milestone%2005/Secure%20the%20App_%20Protected%20Routes%20&%20Auth%20Flow/src/main.jsx)
- **Resolution:** Imported `AuthProvider` from the context directory and wrapped the `<App />` component within `<AuthProvider>` under the `<BrowserRouter>`. This exposes the user, token, authentication status, and actions to the entire page hierarchy, resolving the context unavailability issue.

### Fix 2: Implemented Storage & Token Persistence
- **Changes in:** [AuthContext.jsx](file:///c:/Project-Engineering-main/Milestone%2005/Secure%20the%20App_%20Protected%20Routes%20&%20Auth%20Flow/src/context/AuthContext.jsx)
- **Resolution:** 
  1. Updated the `login` function to store `authToken` (token string) and `authUser` (serialized JSON object) in `localStorage` when credentials are valid.
  2. Updated the `logout` function to remove `authToken` and `authUser` from `localStorage`.
  3. Added a `useEffect` hook executing on mount to retrieve stored credentials from `localStorage`. If a valid token and user are found, the state is automatically populated, preserving authentication status across page reloads.

### Fix 3: Created Protected Route & Guarded Routing Configuration
- **Changes in:**
  - [New Component] [ProtectedRoute.jsx](file:///c:/Project-Engineering-main/Milestone%2005/Secure%20the%20App_%20Protected%20Routes%20&%20Auth%20Flow/src/components/ProtectedRoute.jsx)
  - [App.jsx](file:///c:/Project-Engineering-main/Milestone%2005/Secure%20the%20App_%20Protected%20Routes%20&%20Auth%20Flow/src/App.jsx)
- **Resolution:**
  1. Developed a `ProtectedRoute` component that calls `useAuth()`. If `isAuthenticated` is true, it renders its child components; if false, it redirects to `/login` using `<Navigate to="/login" replace />` to prevent the user from using the back button to navigate to guarded pages.
  2. Modified the router configuration in `App.jsx` to wrap the private page elements (`/dashboard`, `/settings`, `/profile`) inside `<ProtectedRoute>`. Public routes like `/login` and `/` remain open.

### Fix 4: Synchronized Navbar with Auth State
- **Changes in:** [Navbar.jsx](file:///c:/Project-Engineering-main/Milestone%2005/Secure%20the%20App_%20Protected%20Routes%20&%20Auth%20Flow/src/components/Navbar.jsx)
- **Resolution:** Imported `useAuth` and `useNavigate`. Retrieved the `user`, `isAuthenticated`, and `logout` function from context. The Navbar now dynamically renders:
  - If `isAuthenticated` is true: Displays a link to `/profile`, a personalized greeting message (`Hi, {user.name}`), and a "Logout" button which triggers `logout()` and redirects to `/login`.
  - If `isAuthenticated` is false: Displays the default "Login" button.

