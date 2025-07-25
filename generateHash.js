import bcrypt from 'bcrypt'

const password = '123456'  // Cambia aquí la contraseña que quieras hashear

bcrypt.hash(password, 10)
  .then(hash => {
    console.log('Password:', password)
    console.log('Hash:', hash)
  })
  .catch(err => {
    console.error('Error generando hash:', err)
  })
