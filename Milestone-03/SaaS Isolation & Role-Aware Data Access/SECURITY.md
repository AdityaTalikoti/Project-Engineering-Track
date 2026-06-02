# Security Decisions

## 1. Sensitive Fields
The following fields are considered sensitive and have restricted access in the API response:
- **`users.password_hash`**: Extremely sensitive credential data. It is **never** returned in any API response under any circumstances.
- **`users.salary`**: Sensitive financial data. It is filtered out from API responses unless the requesting user has the `admin` role.
- **`billing_details.card_last4`, `billing_details.expiry_date`, `billing_details.billing_address`**: Sensitive payment details. While not currently exposed via the API, the schema and backend policies treat these as restricted, meaning only system or `admin` processes should have read access.

## 2. Tenant Boundaries
To ensure strict multi-tenant isolation, the following constraints have been applied:
- A `tenants` table has been created to uniquely identify organizations.
- A `tenant_id` column has been added to every tenant-specific table (`users`, `projects`, `project_assignments`, `billing_details`).
- Composite `UNIQUE(id, tenant_id)` constraints have been placed on `users` and `projects`.
- All foreign keys now enforce composite referential integrity. For instance, `project_assignments` maps `(user_id, tenant_id)` and `(project_id, tenant_id)`, ensuring a user from Tenant A can never be assigned to a project belonging to Tenant B.
- All API queries explicitly filter by the requesting user's `tenant_id` first (e.g., `WHERE tenant_id = $1`), meaning data from other tenants is completely invisible to the SQL query before role-based filters are even applied.

## 3. Cross-Tenant Risks Prevented
Before these changes, a missing `tenant_id` on the `users` and `projects` tables meant queries inherently returned data globally. Without boundaries, a `user_id` could be submitted to an endpoint to look up an employee from a different company.

**Prevention Measures:**
- Database-Level: Composite Foreign Keys ensure it is physically impossible to map a `billing_detail` or `project_assignment` across two different tenants, completely eliminating horizontal authorization flaws at the data layer.
- API-Level: Every query to the database includes `AND tenant_id = $X` where `$X` is the verified `tenant_id` extracted securely from the requesting user's authenticated context. An attacker cannot query another tenant's project because the `WHERE` clause strictly isolates the result set.

## 4. Role-Based Access Control (RBAC)
We enforce three levels of access within the `users` and `projects` endpoints:
- **Admin**: Has full access. Can list all users, view sensitive fields (like salary), and list all projects within their tenant.
- **Manager**: Has limited team visibility. Can list all users within the tenant and view all projects, but cannot see sensitive financial data like salary.
- **User**: Has highly restricted access. Can only view their own user profile and can only see projects they have explicitly been assigned to via the `project_assignments` table.
