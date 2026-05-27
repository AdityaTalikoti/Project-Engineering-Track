// backend/src/routes/aiRoutes.js
// MIDDLEWARE ORDER IS A CONSTRAINT — do not change the sequence.
// 1. authMiddleware — sets req.user.id (required by aiRateLimit)
// 2. aiRateLimit — uses req.user.id (fails without authMiddleware first)
// 3. validateAIInput — validates input before LLM call
// 4. aiController — calls LLM only if all above pass

import express from 'express'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { aiRateLimit } from '../middleware/aiRateLimit.js'
import { validateAIInput } from '../middleware/validateInput.js'
import { aiController } from '../controllers/aiController.js'

const router = express.Router()

// Endpoint to generate a JWT token for testing/guest sessions
router.post('/auth/login', (req, res) => {
  const { email } = req.body
  const testEmail = email || 'guest@example.com'
  // Clean email to generate a safe userId string
  const userId = testEmail.replace(/[^a-zA-Z0-9]/g, '_')
  
  const token = jwt.sign(
    { userId, email: testEmail },
    process.env.JWT_SECRET || 'supersecretjwtkeyforthischallenge123',
    { expiresIn: '24h' }
  )
  
  res.json({ token, email: testEmail, userId })
})

router.post('/score-email', authMiddleware, aiRateLimit, validateAIInput, aiController)

export default router

