const express = require('express')
const {getAllPaintings, getPendingPaintings, statusHandlePainting} = require('../controllers/adminController')
const { auth, isAdmin } = require('../middlewares/auth')

const routes = express.Router()

//GET
routes.get('/paintings/pending', auth, isAdmin, getPendingPaintings)
routes.get('/paintings', auth, isAdmin, getAllPaintings)

//PATCH, PUT
routes.patch('/paintings/:painting_id/handle', auth, isAdmin, statusHandlePainting)

module.exports = routes;