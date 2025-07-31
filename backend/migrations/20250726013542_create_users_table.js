export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('email').notNullable().unique()
    table.string('passwordHash').notNullable()
    table.string('currentTokenId')
    table.string('role').notNullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
  })
}

export function down(knex) {
  return knex.schema.dropTable('users')
}
