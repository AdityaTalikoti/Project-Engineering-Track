require('dotenv').config()
const express = require('express')
const app = express()
const confessionRoutes = require('./routes/confessionRoutes')

app.use(express.json())

// Routes
app.use('/api/v1/confessions', confessionRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, function() {
  const startStr = `running on ${PORT}`
  console.log(startStr)
})

