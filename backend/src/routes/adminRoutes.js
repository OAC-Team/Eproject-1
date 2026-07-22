const express = require('express')
const {getAllPaintings, getPendingPaintings, statusHandlePainting, getApprovePaintings, getRejectPaintings, deletePainting} = require('../controllers/adminController')
const { auth, isAdmin } = require('../middlewares/auth')

const routes = express.Router()

//GET
routes.get('/paintings/pending', auth, isAdmin, getPendingPaintings)
routes.get('/paintings', auth, isAdmin, getAllPaintings)
routes.get('/paintings/approve', auth, isAdmin, getApprovePaintings)
routes.get('/paintings/reject', auth, isAdmin, getRejectPaintings)

//PATCH, PUT
routes.patch('/paintings/:painting_id/handle', auth, isAdmin, statusHandlePainting)

//DELETE
routes.delete('/paintings/:painting_id/delete', auth, isAdmin, deletePainting)

module.exports = routes;