import bcrypt from 'bcrypt'

export async function seed(knex) {
  const email = 'admin@test.com'
  const plainPassword = '123456'
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(plainPassword, saltRounds)

  await knex('users').insert({ email, passwordHash })
}
