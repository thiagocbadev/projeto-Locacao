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

// Configuração otimizada para produção (nuvem)
mongoose.connect(process.env.MONGO_URI, {
    // Opções recomendadas para MongoDB Atlas
    serverSelectionTimeoutMS: 5000, // Timeout para seleção de servidor
    socketTimeoutMS: 45000, // Timeout para operações
    maxPoolSize: 10, // Número máximo de conexões no pool
    minPoolSize: 5, // Número mínimo de conexões no pool
})
    .then(() => {
        console.log('✅ MongoDB conectado com sucesso!')
        console.log(`📊 Database: ${mongoose.connection.name}`)
    })
    .catch(err => {
        console.error('❌ Erro ao conectar ao MongoDB:', err.message)
        process.exit(1)
    })

// Tratamento de eventos de conexão
mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB desconectado. Tentando reconectar...')
})

mongoose.connection.on('error', (err) => {
    console.error('❌ Erro na conexão MongoDB:', err)
})

app.use(spaceRoutes)
app.use(userRoutes)
app.use(reservationRoutes)

app.listen(3333, () => {
    console.log('Servidor rodando na porta 3333')
})
