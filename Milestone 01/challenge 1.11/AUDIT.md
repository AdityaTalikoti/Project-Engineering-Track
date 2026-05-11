# Pre-Refactor Audit - dev-confessions

This document lists the problems identified in the initial version of the `dev-confessions` application.

## 1. Monolithic Function
- The `handleAll` function (line 6) is a massive conditional block that handles five different responsibilities (create, get all, get one, get by category, delete). It mixes request parsing, validation, business logic, and response formatting.

## 2. Meaningless Variable Names
- `x`: Global counter for IDs. Should be `currentId` or similar.
- `d`: Request body data. Should be `confessionData`.
- `r`: Request parameters. Should be `params`.
- `t`: Operation type string. Should be `operationType`.
- `tmp`: Temporary object for new confession. Should be `newConfession`.
- `arr`: Sorted confessions. Should be `sortedConfessions`.
- `info` / `fn`: Confession search results.
- `i`: Parsed ID. Should be `confessionId`.
- `handler`: Index of confession to delete. Should be `targetIndex`.
- `res2`: Result of `splice` (deleted item). Should be `deletedItems`.
- `stuff`: Filtered confessions. Should be `filteredConfessions`.

## 3. Hardcoded Values
- **Port**: `3000` is hardcoded in `app.listen`.
- **Security Token**: `'supersecret123'` is hardcoded for the delete operation.
- **Categories**: The list of valid categories is duplicated in two places (lines 16 and 63).
- **API Paths**: Repeated strings for routes.

## 4. Lack of MVC Structure
- Everything is in `app.js`. There is no separation between the routing layer, the controller logic, and the data/business services.

## 5. Coding Standards & Logic Issues
- **Deep Nesting**: The `create` block uses nested `if` statements instead of guard clauses, making it hard to read.
- **Inconsistent Keywords**: Uses a mix of `var`, `let`, and `const` without a clear pattern.
- **Global State**: Using global arrays and counters makes the app hard to test and scale.
- **Magic Strings**: Strings like `"bug"`, `"deadline"` etc. are used directly.

## 6. Missing Documentation
- No comments explaining *why* certain validations or logic flows exist.
