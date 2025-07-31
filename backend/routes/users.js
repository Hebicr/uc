// routes/users.js
import express from 'express'
import { dbWithDatabase } from '../connection.js'
import authMiddleware from '../../middleware/authenticateToken.js'
import bcrypt from 'bcrypt'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const [rows] = await dbWithDatabase.query('SELECT id, email FROM users')
    res.json(rows)
  } catch (err) {
    console.error('error loading users:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  const { email, password } = req.body

  if (!email) {
    return res.status(400).json({ error: 'mail required' })
  }

  if (!password) {
    return res.status(400).json({ error: 'password required' })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await dbWithDatabase.query(
      'INSERT INTO users (email, passwordHash) VALUES (?, ?)',
      [email, hashedPassword]
    )
    res.status(201).json({ id: result.insertId, email })
  } catch (error) {
    console.error('error creating user:', error)

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already exists' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})


export default router
