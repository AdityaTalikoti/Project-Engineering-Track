# Pre-Refactor Audit

## Structural & Isolation Problems
1. **Missing Tenants Table**: There is no `tenants` table to represent organizations.
2. **Missing Tenant Identification in `users`**: The `users` table lacks a `tenant_id` column. A query without a tenant filter returns all users across all organizations.
3. **Missing Tenant Identification in `projects`**: The `projects` table lacks a `tenant_id` column. All projects are globally visible.
4. **Missing Tenant Identification in `billing_details`**: The `billing_details` table lacks a `tenant_id` column.
5. **Lack of Project Assignment**: There is no `project_assignments` table to map users to projects, making it impossible to determine which user is assigned to which project for Role-Based Access Control.
6. **Cross-Tenant Reference Risk**: The `billing_details` table references `users(id)` but there is no mechanism to ensure `billing_details` and `users` belong to the same tenant.

## Sensitive Fields & Access Control Problems
7. **Exposed Sensitive Data in `users` API**: The `GET /users` and `GET /users/:id` endpoints return `SELECT * FROM users`, exposing `password_hash` and `salary` to all requesters.
8. **Lack of Role-Based Filtering**: The API layer does not check the requesting user's role to filter sensitive fields (e.g., Admin vs Manager vs User).
9. **Sensitive Fields Identified**:
   - `users.password_hash`: Extremely sensitive, should never be exposed.
   - `users.salary`: Sensitive financial data.
   - `billing_details.card_last4`: Sensitive financial data.
   - `billing_details.expiry_date`: Sensitive financial data.
   - `billing_details.billing_address`: Sensitive data.

## Missing Indexes
10. **Missing Composite Indexes**: There are no composite indexes on `tenant_id` for tenant-specific tables (`users`, `projects`, `billing_details`), which will cause performance issues and full-table scans when filtering by tenant.
