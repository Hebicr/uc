export function up(knex) {
  return knex.schema.createTable('session_audit', (table) => {
    table.increments('id').primary()
    table.string('user_email').notNullable()
    table.string('event_type').notNullable()
    table.string('reason').nullable()
    table.string('token_id').nullable()
    table.string('ip_address').nullable()
    table.string('user_agent').nullable()
    table.timestamp('timestamp').defaultTo(knex.fn.now()).notNullable()
  })
}

export function down(knex) {
  return knex.schema.dropTable('session_audit')
}
