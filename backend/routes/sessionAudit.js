import { dbWithDatabase } from '../connection.js'

export async function logSessionEvent({
  user_email,
  event_type,
  token_id = null,
  ip_address = null,
  user_agent = null,
  reason = null,
}) {
  try {
    await dbWithDatabase.query(
      `INSERT INTO session_audit (user_email, event_type, token_id, ip_address, user_agent, reason, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_email, event_type, token_id, ip_address, user_agent, reason, new Date()]
    )
  } catch (error) {
    console.error('Error logging session event:', error)
  }
}
