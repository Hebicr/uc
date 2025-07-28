// routes/users.js
import express from 'express'
import { dbWithDatabase } from '../connection.js'
import authMiddleware from '../../middleware/authenticateToken.js'

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
    // Aquí debes agregar lógica para encriptar password antes de guardar (bcrypt)
    const [result] = await dbWithDatabase.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password]
    )
    res.status(201).json({ id: result.insertId, email })
  } catch (error) {
    console.error('error creating user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})


export default router
