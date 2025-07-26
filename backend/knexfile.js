import path from 'path'
import { fileURLToPath } from 'url'
import dotenvFlow from 'dotenv-flow'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cambia aquí para apuntar a la carpeta donde está tu .env
dotenvFlow.config({ path: path.resolve(__dirname) })

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: path.resolve(__dirname, 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'seeds')
    }
  }
}
