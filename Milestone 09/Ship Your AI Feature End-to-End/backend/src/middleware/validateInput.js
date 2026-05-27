// backend/src/middleware/validateInput.js
// CONSTRAINT 5: Input validation — length check + at least one content check.

const MAX_INPUT_LENGTH = 3000

export function validateAIInput(req, res, next) {
  const { emailText } = req.body

  // Check 1: Content existence and type
  if (!emailText || typeof emailText !== 'string' || emailText.trim().length === 0) {
    return res.status(400).json({
      error: 'input_required',
      message: 'Email text is required.'
    })
  }

  // Check 2: Length guard
  if (emailText.length > MAX_INPUT_LENGTH) {
    return res.status(400).json({
      error: 'input_too_long',
      limit: MAX_INPUT_LENGTH,
      received: emailText.length
    })
  }

  // Check 3: Domain-specific check (e.g., minimum length of 15 characters)
  if (emailText.trim().length < 15) {
    return res.status(400).json({
      error: 'input_too_short',
      message: 'The email content is too short to score. Please enter at least 15 characters.'
    })
  }

  next()
}
