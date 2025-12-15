const express = require('express')
const ReservationController = require('../controllers/ReservationController')

const routes = express.Router()

routes.post('/reservations', ReservationController.create)
routes.get('/reservations', ReservationController.list)
routes.get('/reservations/:id', ReservationController.show)
routes.delete('/reservations/:id', ReservationController.remove)

module.exports = routes