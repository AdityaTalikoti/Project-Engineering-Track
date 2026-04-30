const express = require('express')
const app = express()

app.use(express.json())

// Constants
const PORT = 3000
const DELETE_TOKEN = process.env.DELETE_TOKEN || 'supersecret123'
const CATEGORIES = ["bug", "deadline", "imposter", "vibe-code"]

// In-memory store (still simple, but encapsulated)
let confessions = []
let idCounter = 0

// Helpers
const isValidId = (id) => Number.isInteger(id) && id > 0

const sendError = (res, status, message) => {
  return res.status(status).json({ error: message })
}

// CREATE
function handleCreate(req, res) {
  const { text, category } = req.body || {}

  if (!text) {
    return sendError(res, 400, 'Text is required')
  }

  if (typeof text !== 'string' || text.trim().length === 0) {
    return sendError(res, 400, 'Text cannot be empty')
  }

  if (text.length >= 500) {
    return sendError(res, 400, 'Text must be less than 500 characters')
  }

  if (!category || !CATEGORIES.includes(category)) {
    return sendError(res, 400, 'Invalid category')
  }

  const confession = {
    id: ++idCounter,
    text: text.trim(),
    category,
    created_at: new Date().toISOString()
  }

  confessions.push(confession)

  console.log(`[CREATE] id=${confession.id}`)

  return res.status(201).json(confession)
}

// GET ALL
function handleGetAll(req, res) {
  const data = [...confessions].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  console.log(`[GET ALL] count=${data.length}`)

  return res.json({
    data,
    count: data.length
  })
}

// GET ONE
function handleGetOne(req, res) {
  const id = parseInt(req.params.id, 10)

  if (!isValidId(id)) {
    return sendError(res, 400, 'Invalid ID')
  }

  const confession = confessions.find(c => c.id === id)

  if (!confession) {
    return sendError(res, 404, 'Confession not found')
  }

  console.log(`[GET ONE] id=${id}`)

  return res.json(confession)
}

// GET BY CATEGORY
function handleGetCat(req, res) {
  const { cat } = req.params

  if (!CATEGORIES.includes(cat)) {
    return sendError(res, 400, 'Invalid category')
  }

  const data = confessions
    .filter(c => c.category === cat)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  console.log(`[GET CATEGORY] cat=${cat} count=${data.length}`)

  return res.json(data)
}

// DELETE
function handleDelete(req, res) {
  const token = req.headers['x-delete-token']

  if (token !== DELETE_TOKEN) {
    return sendError(res, 403, 'Unauthorized')
  }

  const id = parseInt(req.params.id, 10)

  if (!isValidId(id)) {
    return sendError(res, 400, 'Invalid ID')
  }

  const index = confessions.findIndex(c => c.id === id)

  if (index === -1) {
    return sendError(res, 404, 'Confession not found')
  }

  const deleted = confessions.splice(index, 1)[0]

  console.log(`[DELETE] id=${id}`)

  return res.json({
    message: 'Deleted successfully',
    data: deleted
  })
}

// Routes (fixed order)
app.post('/api/v1/confessions', handleCreate)
app.get('/api/v1/confessions', handleGetAll)
app.get('/api/v1/confessions/category/:cat', handleGetCat) // specific first
app.get('/api/v1/confessions/:id', handleGetOne)
app.delete('/api/v1/confessions/:id', handleDelete)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})