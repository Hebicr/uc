import dotenvFlow from 'dotenv-flow'
dotenvFlow.config({ path: './backend' })

import express from 'express'
import cors from 'cors'
import i18next from 'i18next'
import middleware from 'i18next-http-middleware'
import fs from 'fs'
import path from 'path'

import loginRouter from './routes/login.js'  
import logoutRouter from './routes/logout.js'
import validateRouter from './routes/validateToken.js'

// Carga traducciones
const es = JSON.parse(fs.readFileSync(path.resolve('./src/locales/es.json'), 'utf-8'))
const en = JSON.parse(fs.readFileSync(path.resolve('./src/locales/en.json'), 'utf-8'))

i18next
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'es',
    resources: {
      es: { translation: es },
      en: { translation: en },
    },
  })

const app = express()
app.use(cors())
app.use(express.json())
app.use(middleware.handle(i18next))

// Montar routers con prefijos específicos para mayor claridad
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api', validateRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} con DB host ${process.env.DB_HOST}`)
})
