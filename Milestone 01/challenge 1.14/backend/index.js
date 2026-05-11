require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Database setup
const db = new Database('recipes.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    source_url TEXT
  )
`);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// CRUD Routes

// Create
app.post('/recipes', (req, res) => {
  const { title, ingredients, instructions, source_url } = req.body;
  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const stmt = db.prepare('INSERT INTO recipes (title, ingredients, instructions, source_url) VALUES (?, ?, ?, ?)');
  const info = stmt.run(title, ingredients, instructions, source_url);
  res.status(201).json({ id: info.lastInsertRowid, title, ingredients, instructions, source_url });
});

// Read
app.get('/recipes', (req, res) => {
  const recipes = db.prepare('SELECT * FROM recipes').all();
  res.json(recipes);
});

// Update
app.put('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const { title, ingredients, instructions, source_url } = req.body;
  const stmt = db.prepare('UPDATE recipes SET title = ?, ingredients = ?, instructions = ?, source_url = ? WHERE id = ?');
  const info = stmt.run(title, ingredients, instructions, source_url, id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json({ id, title, ingredients, instructions, source_url });
});

// Delete
app.delete('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare('DELETE FROM recipes WHERE id = ?');
  const info = stmt.run(id);
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  res.json({ message: 'Recipe deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
