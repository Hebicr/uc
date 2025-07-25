import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { dbWithDatabase } from './connection.js'

const router = express.Router()

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: req.t('login.missing_credentials') })
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET no está definido')
    return res.status(500).json({ error: 'Internal server error' })
  }

  try {
    const [results] = await dbWithDatabase.query('SELECT * FROM users WHERE email = ?', [email])

    if (results.length === 0) {
      return res.status(401).json({ error: req.t('login.user_not_found') })
    }

    const user = results[0]

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: req.t('login.incorrect_password') })
    }

    // Generar token JWT con id y email
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )

    res.json({ token, user: { id: user.id, email: user.email } })
  } catch (err) {
    console.error('DB error:', err)
    res.status(500).json({ error: req.t('login.error_database') })
  }
})

export default router
