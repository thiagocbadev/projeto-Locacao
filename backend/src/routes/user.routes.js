const express = require('express')
const UserController = require('../controllers/UserController')

const routes = express.Router()

routes.post('/users', UserController.create)
routes.get('/users', UserController.list)
routes.get('/users/:id', UserController.show)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.remove)

module.exports = routes