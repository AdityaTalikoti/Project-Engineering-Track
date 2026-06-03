# CHANGES.md

This file documents every decision made during the refactoring process of the `dev-confessions` application.

## Move 2 - Variable Renaming

| Old Name | New Name | Why |
|---|---|---|
| x | currentId | Describes its role as a counter for generating unique IDs |
| d | confessionData | Clarifies that the variable holds the incoming request body for a confession |
| r | params | Standard name for route parameters |
| t | operationType | Describes the purpose of the parameter in the multi-purpose handler |
| tmp | newConfession | Clearly identifies the object being created and pushed to the array |
| arr | sortedConfessions | Describes both the type (array) and its sorted state |
| info | foundConfession | Indicates it holds the result of a search for a specific confession |
| fn | confession | More descriptive iterator name for the `find` method |
| i | confessionId | Explicitly states that it holds the parsed integer ID |
| cat | categoryName | Descriptive name for the category string from parameters |
| cats | validCategories | Clarifies that this array defines the allowed values |
| stuff | filteredConfessions | Describes that this is a subset of confessions filtered by category |
| handler | targetIndex | Standard name for the index found via `findIndex` |
| res2 | deletedItems | `splice` returns an array of removed elements; this name reflects that |

## Move 3 - Function Splitting

### handleAll() split into:
- `createConfession()`: Validates input and adds a new confession to the data store.
- `getAllConfessions()`: Sorts and returns all confessions.
- `getConfessionById()`: Finds and returns a specific confession by its ID.
- `getConfessionsByCategory()`: Filters and returns confessions belonging to a specific category.
- `deleteConfession()`: Verifies permissions and removes a confession from the data store.

**Why**: The original `handleAll` function was a "God Function" that violated the Single Responsibility Principle. Splitting it makes the code modular, easier to read, and simpler to test.

## Move 4 - MVC Folder Structure

### Reorganized into:
- `routes/confessionRoutes.js`: Receives HTTP requests and delegates immediately to the controller.
- `controllers/confessionController.js`: Extracts request data, calls the confession service, and sends responses.
- `services/confessionService.js`: Contains all business logic and manages the in-memory data store.

**Why**: This separation of concerns ensures that the routing logic doesn't care about business rules, and the business logic doesn't care about HTTP details (req/res). It makes the codebase maintainable and scalable.

## Move 5 - Centralise Environment Variables

### Changes made:
- Created `.env` and `.env.example` to store configurable values.
- Moved `PORT` and `DELETE_TOKEN` to environment variables.
- Added `dotenv` package to load configuration.

**Why**: Hardcoding secrets and configuration is a security risk and makes the application difficult to deploy.

## Move 6 - Inline Comments

### Changes made:
- Added "why" comments to `confessionService.js`.
- Explained logic behind character limits, category restrictions, and authentication.

**Why**: Comments explain the intent and rationale behind non-obvious logic, aiding future maintenance.
