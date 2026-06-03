let confessions = []
let currentId = 0
// Defined globally to ensure consistent categorization across the app
const validCategories = ["bug", "deadline", "imposter", "vibe-code"]

function create(confessionData) {
  // Validate text existence and length to prevent empty or oversized database entries
  if (!confessionData.text) {
    throw { status: 400, message: 'need text' }
  }

  if (confessionData.text.length === 0) {
    throw { status: 400, message: "too short" }
  }

  // 500 characters is the limit to ensure confessions remain concise and readable
  if (confessionData.text.length >= 500) {
    throw { status: 400, message: "text too big, must be less than 500 characters long buddy" }
  }

  // Restricted categories maintain a focused scope for the developer community
  if (!validCategories.includes(confessionData.category)) {
    throw { status: 400, message: "category not in stuff" }
  }

  const newConfession = {
    id: ++currentId,
    text: confessionData.text,
    category: confessionData.category,
    created_at: new Date()
  }

  confessions.push(newConfession)
  return newConfession
}

function getAll() {
  // Sorting by date descending ensures the freshest "confessions" are seen first
  return confessions.sort((a, b) => b.created_at - a.created_at)
}

function getById(id) {
  const foundConfession = confessions.find(confession => confession.id === id)
  if (!foundConfession) {
    throw { status: 404, message: 'not found' }
  }
  // Sanity check to ensure data integrity
  if (!foundConfession.text) {
    throw { status: 500, message: "broken" }
  }
  return foundConfession
}

function getByCategory(categoryName) {
  if (!validCategories.includes(categoryName)) {
    throw { status: 400, message: 'invalid category' }
  }

  // Filtering by category allows developers to find relatable content quickly
  return confessions
    .filter(confession => confession.category === categoryName)
    .reverse()
}

function remove(id, token) {
  // Authentication via a custom header prevents accidental or unauthorized deletions
  if (token !== process.env.DELETE_TOKEN) {
    throw { status: 403, message: 'no permission' }
  }

  const targetIndex = confessions.findIndex(item => item.id === id)
  if (targetIndex === -1) {
    throw { status: 404, message: "not found buddy" }
  }

  // Splice returns the deleted items; we return the specific one for confirmation
  const deletedItems = confessions.splice(targetIndex, 1)
  return deletedItems[0]
}

module.exports = {
  create,
  getAll,
  getById,
  getByCategory,
  remove,
  validCategories
}

