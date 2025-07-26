// validateToken.js
import express from 'express'
import authenticateToken from '../../middleware/authenticateToken.js'

const router = express.Router()

router.post('/validate-token', authenticateToken, (req, res) => {
  res.json({ message: 'valid token' })
})

export default router
