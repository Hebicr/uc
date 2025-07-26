import mysql from 'mysql2/promise'
import dotenvFlow from 'dotenv-flow'
import { exec } from 'child_process'
import knexConfig from './knexfile.js'
import knexLib from 'knex'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables de entorno según NODE_ENV
dotenvFlow.config({ path: path.resolve(__dirname) })
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV } = process.env

const knexEnv = NODE_ENV || 'development'

const createDatabaseIfNotExists = async () => {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD
  })

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``)
  console.log(`✅ Base de datos '${DB_NAME}' verificada o creada.`)
  await connection.end()
}

const runMigrations = async () => {
  const knex = knexLib(knexConfig[knexEnv])
  await knex.migrate.latest()
  console.log('✅ Migraciones aplicadas.')
  await knex.destroy()
}

const runSeeds = async () => {
  const knex = knexLib(knexConfig[knexEnv])
  await knex.seed.run()
  console.log('✅ Seeds aplicados.')
  await knex.destroy()
}

const init = async () => {
  try {
    if (!DB_NAME) throw new Error('DB_NAME no definido en .env')

    await createDatabaseIfNotExists()
    await runMigrations()
    await runSeeds()
  } catch (err) {
    console.error('❌ Error al inicializar DB:', err)
    process.exit(1)
  }
}

init()
