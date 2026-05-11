const confessionService = require('../services/confessionService')

function createConfession(req, res) {
  try {
    const newConfession = confessionService.create(req.body)
    console.log("added one info " + newConfession.id)
    res.status(201).json(newConfession)
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.message } || error)
  }
}

function getAllConfessions(req, res) {
  const sortedConfessions = confessionService.getAll()
  const result = {
    data: sortedConfessions,
    count: sortedConfessions.length
  }
  console.log("fetching all data result")
  res.json(result)
}

function getConfessionById(req, res) {
  try {
    const confessionId = parseInt(req.params.id)
    const foundConfession = confessionService.getById(confessionId)
    console.log("found info with " + foundConfession.text.length + " chars")
    res.json(foundConfession)
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.message } || error)
  }
}

function getConfessionsByCategory(req, res) {
  try {
    const categoryName = req.params.cat
    const filteredConfessions = confessionService.getByCategory(categoryName)
    res.json(filteredConfessions)
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.message } || error)
  }
}

function deleteConfession(req, res) {
  try {
    const confessionId = parseInt(req.params.id)
    if (isNaN(confessionId)) {
      return res.status(400).send("no id")
    }

    const token = req.headers['x-delete-token']
    const deletedItem = confessionService.remove(confessionId, token)
    console.log("deleted something")
    res.json({ msg: "ok", item: deletedItem })
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.message } || error)
  }
}

module.exports = {
  createConfession,
  getAllConfessions,
  getConfessionById,
  getConfessionsByCategory,
  deleteConfession
}
