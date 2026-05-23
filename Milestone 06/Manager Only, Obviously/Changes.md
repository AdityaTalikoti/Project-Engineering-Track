# Changes.md

## Checkpoint 1 — Role in the User Model and JWT
- **User Model Role Field:** Yes, the User model (`models/User.js`) has a `role` field defined as:
  ```javascript
  role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' }
  ```
- **Allowed Values:** `'user'`, `'manager'`, `'admin'`.
- **JWT Payload inclusion:** No, the token generation function in `controllers/authController.js` (both `login` and `signup` routes) signs the token with:
  ```javascript
  { userId: user._id, email: user.email }
  ```
  It **excludes** the `role` field from the JWT payload.
- **Consequence:** Since `role` is not in the token, any middleware relying purely on decoding the JWT token to extract the role (e.g. `decoded.role`) would retrieve `undefined`, causing all role checks at the middleware level to fail or return `undefined`. Although `authMiddleware.js` populates `req.user` by querying the database using `User.findById(decoded.userId)`, not having the role in the token limits stateless authentication capability and is a configuration gap.

## Checkpoint 2 — Role Middleware Existence
- **Existence of requireRole middleware:** No `requireRole` middleware or similar role-based middleware exists anywhere in the codebase.
- **Usage on routes:** Since it does not exist, no routes are protected by any role-based restrictions. Only a generic `protect` middleware exists for authentication.

## Checkpoint 3 — Route Protection Coverage
Below is the audit table of route protection coverage:

| Route | Sensitive? | Currently Restricted? | Should Be Restricted To |
| --- | --- | --- | --- |
| `POST /api/expenses` | No | No (Only authenticated via `protect`) | `user`, `manager`, `admin` |
| `GET /api/expenses/mine` | No | No (Only authenticated via `protect`) | `user`, `manager`, `admin` |
| `GET /api/expenses` | Yes | No (Only authenticated via `protect`) | `manager`, `admin` |
| `PUT /api/expenses/:id/approve` | Yes | No (Only authenticated via `protect`) | `manager`, `admin` |
| `PUT /api/expenses/:id/reject` | Yes | No (Only authenticated via `protect`) | `manager`, `admin` |
| `DELETE /api/expenses/:id` | Yes | No (Only authenticated via `protect`) | `admin` |
| `GET /api/users` | Yes | No (Only authenticated via `protect`) | `admin` |
| `PUT /api/users/:id/role` | Yes | No (Only authenticated via `protect`) | `admin` |
| `GET /api/users/me` | No | No (Only authenticated via `protect`) | `user`, `manager`, `admin` |

## Checkpoint 4 — Ownership Gaps
- **Ownership Check Route:** `PUT /api/expenses/:id` (updating an expense) and `DELETE /api/expenses/:id` (deleting an expense).
- **Check present:** No. In `expenseController.js`, `updateExpense` updates the record directly using `findByIdAndUpdate` without verifying that the requesting user (`req.user._id`) owns the expense (`submittedBy`).
- **Can User A edit User B's expense?** Yes, as demonstrated in our audit where Regular User (User A) successfully changed the title and amount of Manager's (User B's) expense to `"Hacked Coffee"` and `1000`.

---

## 1. Role Gap Audit
The complete list of actions a regular user could perform before any fix was applied, with the HTTP method, endpoint, and the response received:

- **Action:** View ALL expenses
  - **Method:** `GET`
  - **Endpoint:** `/api/expenses`
  - **Status:** `200`
  - **Response:** Returned list of all expenses in the system.
- **Action:** Approve an expense
  - **Method:** `PUT`
  - **Endpoint:** `/api/expenses/:id/approve`
  - **Status:** `200`
  - **Response:** Successfully changed status to `'approved'` and returned the updated expense.
- **Action:** Reject an expense
  - **Method:** `PUT`
  - **Endpoint:** `/api/expenses/:id/reject`
  - **Status:** `200`
  - **Response:** Successfully changed status to `'rejected'` and returned the updated expense.
- **Action:** Delete an expense
  - **Method:** `DELETE`
  - **Endpoint:** `/api/expenses/:id`
  - **Status:** `200`
  - **Response:** `{"message":"Expense removed"}`.
- **Action:** View all users
  - **Method:** `GET`
  - **Endpoint:** `/api/users`
  - **Status:** `200`
  - **Response:** Returned detailed array of all users with IDs, emails, names, and roles.
- **Action:** Change user's role
  - **Method:** `PUT`
  - **Endpoint:** `/api/users/:id/role`
  - **Status:** `200`
  - **Response:** Successfully updated role from `'user'` to `'manager'` and returned the updated user.
- **Action:** Edit another user's expense
  - **Method:** `PUT`
  - **Endpoint:** `/api/expenses/:id`
  - **Status:** `200`
  - **Response:** Successfully edited manager's expense to `"Hacked Coffee"` with amount `1000`.

---

## 2. Root Cause Analysis
For each permission gap found:

1. **View All Expenses Gap**
   - **Route File:** `routes/expenseRoutes.js` (Line 15)
   - **Missing:** Role-based restriction middleware (`requireRole('manager', 'admin')`).
   - **Malicious Exploit:** Any regular employee can view all organization expenses, leaking sensitive financial/purchase details of other users.

2. **Approve / Reject Expenses Gap**
   - **Route File:** `routes/expenseRoutes.js` (Lines 19, 20)
   - **Missing:** Role-based restriction middleware (`requireRole('manager', 'admin')`).
   - **Malicious Exploit:** Any employee can approve their own or other employees' expenses, leading to financial fraud.

3. **Delete Expense Gap**
   - **Route File:** `routes/expenseRoutes.js` (Line 21)
   - **Missing:** Role-based restriction middleware (`requireRole('admin')`).
   - **Malicious Exploit:** Any employee can delete any expense record, destroying audit logs and financial records.

4. **View All Users Gap**
   - **Route File:** `routes/userRoutes.js` (Line 7)
   - **Missing:** Role-based restriction middleware (`requireRole('admin')`).
   - **Malicious Exploit:** Employees can harvest names, emails, and roles of everyone in the company (information disclosure).

5. **Change User Role Gap**
   - **Route File:** `routes/userRoutes.js` (Line 8)
   - **Missing:** Role-based restriction middleware (`requireRole('admin')`).
   - **Malicious Exploit:** An employee can elevate their own privilege to `'manager'` or `'admin'`, obtaining complete access to the system.

6. **Expense Ownership Editing/Deletion Gap**
   - **Controller File:** `controllers/expenseController.js` (Lines 36-40, 69-72)
   - **Missing:** Check verifying `submittedBy === req.user._id` (or if requesting user is manager/admin).
   - **Malicious Exploit:** A user can edit the category, amount, or details of other users' expenses, or delete them to hide tracks.

---

## 3. Access Model
The completed access model table filled in with findings on what was currently allowed vs what should be allowed:

| Action | Endpoint | Allowed Roles (Target) | Currently Allowed? |
| --- | --- | --- | --- |
| Submit an expense | `POST /api/expenses` | `user`, `manager`, `admin` | Yes (everyone) |
| View own expenses | `GET /api/expenses/mine` | `user`, `manager`, `admin` | Yes (everyone) |
| View ALL expenses | `GET /api/expenses` | `manager`, `admin` | Yes (everyone) |
| Approve an expense | `PUT /api/expenses/:id/approve` | `manager`, `admin` | Yes (everyone) |
| Reject an expense | `PUT /api/expenses/:id/reject` | `manager`, `admin` | Yes (everyone) |
| Delete an expense | `DELETE /api/expenses/:id` | `admin only` | Yes (everyone) |
| View all users | `GET /api/users` | `admin only` | Yes (everyone) |
| Change a user's role | `PUT /api/users/:id/role` | `admin only` | Yes (everyone) |
| View own profile | `GET /api/users/me` | `user`, `manager`, `admin` | Yes (everyone) |

---

## 4. What I Fixed
*(TBD - to be filled in after applying fixes)*

---

## 5. Verification Results
*(TBD - to be filled in after executing scenario tests)*
