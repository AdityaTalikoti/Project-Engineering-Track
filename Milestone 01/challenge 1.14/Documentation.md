# RecipeVault — Technical Documentation

## Section 1 — System Architecture

RecipeVault is a full-stack web application built using a decoupled client-server architecture. It is designed for simplicity, performance, and ease of deployment.

### Component Overview
- **Frontend**: A single-page application (SPA) built with Vanilla JavaScript, HTML5, and CSS3. It handles the User Interface (UI) and makes asynchronous HTTP requests to the backend.
- **Backend**: A Node.js environment running an Express.js server. It serves as the bridge between the user and the data, handling business logic and API routing.
- **Database**: SQLite (via the `better-sqlite3` library). This is a file-based relational database that resides on the same server as the backend, ensuring low latency.

### Architecture Flow
1. **User Action**: The user submits a form on the frontend.
2. **Fetch Request**: The frontend uses the `fetch` API to send a JSON payload to the backend.
3. **API Processing**: The Express backend receives the request and validates the data.
4. **Database Operation**: The backend executes a SQL query against the SQLite database.
5. **Response**: The database returns the result to the backend, which sends a JSON response back to the browser.
6. **UI Update**: The frontend receives the data and updates the DOM dynamically.

**Deployment Summary:**
- **Frontend**: Served as static assets by the Express backend (deployed to Google Cloud Run).
- **Backend**: Deployed as a containerized service on Google Cloud Run.
- **Database**: SQLite file stored locally within the container instance (persistent storage via Volume Mounts).
- **External APIs**: None used (fully self-contained).

---

## Section 2 — API Documentation

| HTTP Method | Route Path | Request Body | Response Format (Success) | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/recipes` | None | `Array of { id, title, ingredients, ... }` | `200 OK`, `500 Internal Error` |
| **POST** | `/recipes` | `{ "title": string, "ingredients": string, "instructions": string, "source_url": string }` | `{ "id": number, "title": "...", ... }` | `201 Created`, `400 Bad Request` |
| **PUT** | `/recipes/:id` | `{ "title": string, "ingredients": string, ... }` | `{ "id": "...", "title": "...", ... }` | `200 OK`, `404 Not Found` |
| **DELETE** | `/recipes/:id` | None | `{ "message": "Recipe deleted successfully" }` | `200 OK`, `404 Not Found` |
| **GET** | `/health` | None | `{ "status": "ok" }` | `200 OK` |

---

## Section 3 — Database Design

RecipeVault uses a relational schema to manage culinary data. The current implementation supports categorized recipes for better organization.

### Entity Relationship Diagram (ERD) Logic

**Recipes Table**
| Field | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| `title` | TEXT | NOT NULL | Name of the dish |
| `ingredients` | TEXT | NOT NULL | List of required items |
| `instructions` | TEXT | NOT NULL | Step-by-step process |
| `source_url` | TEXT | OPTIONAL | Link to original recipe |
| `category_id` | INTEGER | FOREIGN KEY | Ref: `categories(id)` |

**Categories Table**
| Field | Type | Constraints | Notes |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Unique identifier |
| `name` | TEXT | NOT NULL, UNIQUE | e.g., "Desserts", "Main Course" |

**Relationship**: One Category has many Recipes. Each recipe belongs to exactly one category via the `category_id` foreign key.

---

## Section 4 — Deployment Documentation

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/AdityaTalikoti/Project-Engineering-Track.git
   cd "Milestone 01/challenge 1.14"
   ```

2. **Install backend dependencies**
   ```bash
   cd backend && npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the `backend/` directory:
   - `PORT`: 3000 (The port the server will listen on)

4. **Run the backend**
   ```bash
   node index.js
   ```
   The server will start at `http://localhost:3000`.

5. **Open the frontend**
   Navigate to `http://localhost:3000` in any modern web browser.

### Deployed URLs
- **Backend/API**: `https://recipevault-api.a.run.app` (Placeholder)
- **Frontend**: `https://recipevault.web.app` (Placeholder)

---

## Section 5 — Codebase Structure

```text
challenge-1.14/
├── backend/
│   ├── recipes.db       ← SQLite Database file (binary)
│   ├── index.js         ← Express entry point & API route handlers
│   ├── .env             ← Environment configuration
│   └── package.json     ← Backend dependencies & scripts
│
├── frontend/
│   ├── index.html       ← Main entry point (Structure)
│   ├── style.css        ← Design & Glassmorphism styles
│   └── app.js           ← Frontend logic (Fetch calls & UI updates)
│
├── .gitignore           ← Files to exclude from Git
└── README.md            ← Project overview & high-level documentation
```
