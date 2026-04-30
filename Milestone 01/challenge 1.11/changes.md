# CHANGES.md

## Refactor Summary - Dev Confessions API

### Architecture Improvements
- Split monolithic handler into dedicated route handlers (create, getAll, getOne, getCat, delete)
- Improved route ordering to prevent ambiguity (`/category/:cat` before `/:id`)

### Validation Improvements
- Replaced deeply nested validation with early return pattern
- Added consistent input validation for:
  - text (required, non-empty, <500 chars)
  - category (must exist and be valid)
  - id (must be valid integer)

### Constants & DRY Fixes
- Extracted category list into `CATEGORIES` constant
- Extracted delete token into environment variable (`DELETE_TOKEN`)
- Removed duplicated category arrays

### Error Handling Standardization
- Unified all error responses to `{ error: message }`
- Created reusable `sendError` helper
- Removed mixed `.send()` and `.json()` usage

### Security Improvements
- Removed hardcoded delete token from logic
- Added environment variable support
- Improved unauthorized response handling

### Data Handling Improvements
- Converted `created_at` to ISO string for consistent serialization
- Prevented mutation in GET ALL by copying array before sorting
- Added ID validation before usage

### Code Quality Improvements
- Replaced `var` with `const` / `let`
- Improved variable naming (no more `d`, `r`, `x`, etc.)
- Simplified filter logic using arrow functions
- Removed redundant/unused conditionals
- Standardized function syntax

### Logging Improvements
- Replaced vague logs with structured logs:
  - [CREATE], [GET ALL], [GET ONE], [GET CATEGORY], [DELETE]
  - Included relevant metadata (id, count, category)

### Performance & Consistency
- Standardized sorting strategy across endpoints (by `created_at`)
- Removed inefficient `.reverse()` usage
- Ensured consistent response structures

### Removed Dead / Useless Code
- Removed useless memory check (`confessions.length > 500`)
- Removed redundant `info.text` existence check

---

## Remaining Limitations (Known)
- Still uses in-memory storage (data lost on restart)
- No authentication system beyond simple token
- No rate limiting or API protection
- No database or persistence layer
- No test coverage yet