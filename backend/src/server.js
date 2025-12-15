require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const reservationRoutes = require('./routes/reservation.routes')
const spaceRoutes = require('./routes/space.routes')
const userRoutes = require('./routes/user.routes')

const app = express()

app.use(cors())
app.use(express.json())

if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI não encontrada no .env')
    process.exit(1)
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error(err))

app.use(spaceRoutes)
app.use(userRoutes)
app.use(reservationRoutes)

app.listen(3333, () => {
    console.log('Servidor rodando na porta 3333')
})
