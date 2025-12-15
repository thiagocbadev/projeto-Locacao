const express = require('express')
const UserController = require('../controllers/UserController')

const routes = express.Router()

routes.post('/users', UserController.create)
routes.get('/users', UserController.list)
routes.get('/users/:id', UserController.show)
routes.delete('/users/:id', UserController.remove)

module.exports = routes