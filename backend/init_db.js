import { dbWithoutDatabase, dbWithDatabase } from './connection.js'
import dotenvFlow from 'dotenv-flow'
import bcrypt from 'bcrypt'
dotenvFlow.config()

const initDatabase = async () => {
  try {
    const dbName = process.env.DB_NAME
    if (!dbName) throw new Error('DB_NAME no definido')

    console.log('Creando base de datos:', dbName)
    await dbWithoutDatabase.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``)
    console.log('Base creada o ya existía.')

    console.log('Creando tabla users...')
    await dbWithDatabase.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        passwordHash VARCHAR(255) NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('Tabla users creada o ya existía.')

    // Datos de usuario a insertar
    const email = 'admin@test.com'
    const plainPassword = '123456'

    // Hashear contraseña con bcrypt (saltRounds = 10)
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(plainPassword, saltRounds)

    // Insertar usuario
    const sql = 'INSERT INTO users (email, passwordHash) VALUES (?, ?)'
    await dbWithDatabase.query(sql, [email, passwordHash])
    console.log('Usuario ejemplo insertado con contraseña hasheada.')

    await dbWithoutDatabase.end()
    await dbWithDatabase.end()

  } catch (err) {
    console.error('Error inicializando base:', err)
    process.exit(1)
  }
}

initDatabase()
