import jwt from 'jsonwebtoken'
import { dbWithDatabase } from '../backend/connection.js'
import { logSessionEvent } from '../backend/routes/sessionAudit.js' // Ajusta la ruta según dónde pongas la función

export default async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const forwarded = req.headers['x-forwarded-for']
  const ip_raw = forwarded ? forwarded.split(',')[0].trim() : (req.ip || req.connection.remoteAddress)
  const ip = (ip_raw === '::1' || ip_raw === '::ffff:127.0.0.1') ? '127.0.0.1' : ip_raw

  const userAgent = req.headers['user-agent'] || 'unknown'

  if (!token) {
    return res.status(401).json({ error: 'Token missing' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const [results] = await dbWithDatabase.query(
      'SELECT currentTokenId, email FROM users WHERE id = ?',
      [decoded.id]
    )

    if (results.length === 0) {
      await logSessionEvent({
        user_email: 'unknown',
        event_type: 'token_invalid',
        token_id: decoded.tokenId,
        ip_address: ip,
        user_agent: userAgent,
        reason: 'User not found'
      })
      return res.status(401).json({ error: 'User not found' })
    }

    const user = results[0]

    if (user.currentTokenId !== decoded.tokenId) {
      await logSessionEvent({
        user_email: user.email,
        event_type: 'session_invalidated',
        token_id: decoded.tokenId,
        ip_address: ip,
        user_agent: userAgent,
        reason: 'Session invalidated due to token mismatch'
      })
      return res.status(401).json({ error: 'Session invalidated' })
    }

    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
  try {
    const decoded = jwt.decode(token)

    if (decoded?.id) {
      const email = decoded.email || 'unknown'

      // Limpiar token expirado
      await dbWithDatabase.query(
        'UPDATE users SET currentTokenId = NULL WHERE id = ?',
        [decoded.id]
      )

      // Log de expiración
      await logSessionEvent({
        user_email: email,
        event_type: 'token_expired',
        token_id: decoded.tokenId,
        ip_address: ip,
        user_agent: userAgent,
        reason: 'Token expired'
      })

      console.log(`Token expirado registrado para ${email}`)
    } else {
      console.warn('No se pudo decodificar el token para registrar expiración.')
    }
  } catch (cleanupError) {
    console.error('Error al limpiar o registrar token expirado:', cleanupError)
  }

  return res.status(401).json({ error: 'Token expired' })
}
    console.error('Token verification error:', err)
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}
