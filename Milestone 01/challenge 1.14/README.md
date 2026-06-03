# RecipeVault | Personal Recipe Tracker

## Q1: What is it?
A premium web application to log and track your personal recipe collection, including ingredients, steps, and source links.

## Q2: What problem does it solve?
I often find great recipes on social media or in books but lose them by the time I actually want to cook. This app centralizes all my culinary inspirations in one place so I can find exactly what I need when I'm in the kitchen.

## Q3: What did you intentionally exclude?
I intentionally excluded **User Authentication**. While essential for a public app, adding JWT or session-based login would have significantly increased the scope of this MVP. Since this is for personal use, a simple local deployment or a single-user cloud instance is sufficient.

---

### Tech Stack
- **Backend:** Node.js + Express
- **Database:** SQLite (via `better-sqlite3`)
- **Frontend:** HTML5, Vanilla CSS, Vanilla JavaScript
- **Local Testing:** Express static file serving

### Live Links
- **Frontend:** [Localhost:3000] (Deployment skipped per request)
- **Backend:** [Localhost:3000/recipes] (Deployment skipped per request)

### How to Run Locally
1. Navigate to `backend/` and run `npm install`.
2. Run `node index.js`.
3. Open `http://localhost:3000` in your browser.
4. The server handles both the API and serving the frontend files.
