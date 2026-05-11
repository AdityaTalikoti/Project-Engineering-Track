# Dev Confessions - Refactored

A clean, modular version of the developer confessions application, refactored for better maintainability and scalability.

## Live Deployment
- **URL**: [Deploy to Render](https://render.com/) (Recommended)
- **Instructions**: 
  1. Push this repository to GitHub.
  2. Create a "New Web Service" on Render.
  3. Set Build Command: `npm install`
  4. Set Start Command: `npm start`
  5. Add Environment Variables: `PORT=10000`, `DELETE_TOKEN=your_secret_token`

## How to Run Locally
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file based on `.env.example`.
4. Run `npm start` or `npm run dev`.

## Refactoring Details
Refer to [AUDIT.md](./AUDIT.md) for the pre-refactor analysis and [CHANGES.md](./CHANGES.md) for a detailed log of all modifications.

## Endpoints

- GET /api/v1/confessions
- POST /api/v1/confessions
- GET /api/v1/confessions/:id
- GET /api/v1/confessions/category/:cat
- DELETE /api/v1/confessions/:id

## Run with:
npm install && npm start

## Port: 3000
