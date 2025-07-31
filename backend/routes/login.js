import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { dbWithDatabase } from '../connection.js'

const router = express.Router()

async function logSessionEvent({ user_email, event_type, token_id = null, ip_address, user_agent, reason = null }) {
  await dbWithDatabase.query(
    `INSERT INTO session_audit (user_email, event_type, token_id, ip_address, user_agent, reason) VALUES (?, ?, ?, ?, ?, ?)`,
    [user_email, event_type, token_id, ip_address, user_agent, reason]
  )
}

router.post('/', async (req, res) => {
  const { email, password } = req.body
  const forwarded = req.headers['x-forwarded-for']
  const ip_raw = forwarded ? forwarded.split(',')[0].trim() : (req.ip || req.connection.remoteAddress)
  const ip = (ip_raw === '::1' || ip_raw === '::ffff:127.0.0.1') ? '127.0.0.1' : ip_raw
  const userAgent = req.headers['user-agent'] || ''

  if (!email || !password) {
    await logSessionEvent({
      user_email: email || 'unknown',
      event_type: 'login_failed',
      ip_address: ip,
      user_agent: userAgent,
      reason: 'Missing credentials',
    })
    return res.status(400).json({ error: req.t('login.missing_credentials') })
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET no está definido')
    return res.status(500).json({ error: 'Internal server error' })
  }

  try {
    const [results] = await dbWithDatabase.query('SELECT id, email, passwordHash, currentTokenId, role FROM users WHERE email = ?', [email])

    if (results.length === 0) {
      await logSessionEvent({
        user_email: email,
        event_type: 'login_failed',
        ip_address: ip,
        user_agent: userAgent,
        reason: 'User not found',
      })
      return res.status(401).json({ error: req.t('login.user_not_found') })
    }

    const user = results[0]

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      await logSessionEvent({
        user_email: email,
        event_type: 'login_failed',
        ip_address: ip,
        user_agent: userAgent,
        reason: 'Incorrect password',
      })
      return res.status(401).json({ error: req.t('login.incorrect_password') })
    }

    // ❌ Si ya hay una sesión activa, denegar el nuevo login
    if (user.currentTokenId) {
      await logSessionEvent({
        user_email: email,
        event_type: 'login_failed',
        ip_address: ip,
        user_agent: userAgent,
        reason: 'Session already active',
      })
      return res.status(401).json({ error: req.t('login.session_already_active') })
    }

    // ✅ Generar nuevo tokenId único para esta sesión
    const tokenId = uuidv4()

    // Guardar tokenId en la base de datos
    await dbWithDatabase.query(
      'UPDATE users SET currentTokenId = ? WHERE id = ?',
      [tokenId, user.id]
    )

    await logSessionEvent({
      user_email: user.email,
      event_type: 'login_success',
      token_id: tokenId,
      ip_address: ip,
      user_agent: userAgent,
    })

    // Crear token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, tokenId , role:user.role},
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } })
  } catch (err) {
    console.error('DB error:', err)
    res.status(500).json({ error: req.t('login.error_database') })
  }
})

export default router
