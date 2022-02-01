process.stdout.write('\x1B[2J\x1B[0f')
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

;(async function() {

  // Iniciar mongoose
  try {
   await mongoose.connect(process.env.MONGO_URL, {
     dbName: process.env.MONGO_DB
   })
   console.log('Connected to DB')
  } catch (err) {
    console.error(`Error connecting to DB: ${err}`)
  }

  //Middlewares
  try {
    const api = express()
    .use(cors())
    .use(morgan('dev'))
    .use(express.json())

  //Router
    .use('/api', require('./api/routes'))

  //Iniciar servidor
    const port = process.env.PORT
    api.listen(port, (err) => {
      if(err) {
        console.error(`Error en servidor: ${err}`)
      }
      console.info('-'.repeat(40))
      console.info('💻 Reboot Server Live')
      console.info(`📡 PORT: http://localhost:${port}`)
      console.info('-'.repeat(40))
    })
  } catch (error) {
    throw new Error(error)
  }
})()