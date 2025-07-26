import express from 'express'
import authenticateToken from '../../middleware/authenticateToken.js'
import { dbWithDatabase } from '../connection.js'

// Función para loguear eventos de sesión (puedes importarla si está en otro archivo)
async function logSessionEvent({ user_email, event_type, token_id = null, ip_address, user_agent, reason = null }) {
  await dbWithDatabase.query(
    `INSERT INTO session_audit (user_email, event_type, token_id, ip_address, user_agent, reason) VALUES (?, ?, ?, ?, ?, ?)`,
    [user_email, event_type, token_id, ip_address, user_agent, reason]
  )
}

const router = express.Router()

router.post('/', authenticateToken, async (req, res) => {
  // Obtener IP real del cliente
  const forwarded = req.headers['x-forwarded-for']
  const ip_raw = forwarded ? forwarded.split(',')[0].trim() : (req.ip || req.connection.remoteAddress)
  const ip_address = (ip_raw === '::1' || ip_raw === '::ffff:127.0.0.1') ? '127.0.0.1' : ip_raw
  const userAgent = req.headers['user-agent'] || ''

  try {
    // Limpiar currentTokenId para invalidar sesión
    await dbWithDatabase.query(
      'UPDATE users SET currentTokenId = NULL WHERE id = ?',
      [req.user.id]
    )

    // Registrar auditoría de logout con tokenId
    await logSessionEvent({
      user_email: req.user.email,
      event_type: 'logout_success',
      token_id: req.user.tokenId,
      ip_address,
      user_agent: userAgent
    })

    res.json({ message: req.t('logout.success') || 'Sesión cerrada correctamente' })
  } catch (err) {
    console.error('Logout error:', err)
    res.status(500).json({ error: req.t('logout.error') || 'Error al cerrar sesión' })
  }
})

export default router
