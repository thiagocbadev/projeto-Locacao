const express = require('express')
const SpaceController = require('../controllers/SpaceController')

const routes = express.Router()

routes.post('/spaces', SpaceController.create)
routes.get('/spaces', SpaceController.list)
routes.get('/spaces/:id', SpaceController.show)

routes.delete('/spaces/:id', SpaceController.remove)

module.exports = routes