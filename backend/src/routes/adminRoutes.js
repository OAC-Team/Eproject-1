const express = require('express')
const {
    getAllPaintings,
    getPendingPaintings,
    statusHandlePainting,
    getApprovePaintings,
    getRejectPaintings,
    deletePainting,
    getAllUser,
    getUser,
    updateStatusUser,
    verifyAdminPassword,
    getAdminLog,
    resetUserPassword,
    getUserLog,
    updateUserProfileByAdmin,
    getAllUserLogs,
    deleteUserLog,
    getRejectedPaintingsByUser } = require('../controllers/adminController');
const { auth, isAdmin } = require('../middlewares/auth')

const routes = express.Router()

//users
//GET
routes.get('/users', auth, isAdmin, getAllUser)
routes.get('/users/:user_id', auth, isAdmin, getUser)
routes.get('/userLog/:user_id', auth, isAdmin, getUserLog)
routes.get('/userLogs', auth, isAdmin, getAllUserLogs)
routes.get('/users/:user_id/rejected-paintings', auth, isAdmin, getRejectedPaintingsByUser)

//PATCH, PUT, DELETE
routes.patch('/users/:user_id/status', auth, isAdmin, updateStatusUser)
routes.patch('/users/:user_id/reset-password', auth, isAdmin, resetUserPassword)
routes.patch('/users/:user_id/profile', auth, isAdmin, updateUserProfileByAdmin)
routes.delete('/userLog/:log_id', auth, isAdmin, deleteUserLog)

//admin
//GET
routes.get('/adminLog/:targetUserId', auth, isAdmin, getAdminLog)

//POST
routes.post('/verify-password', auth, isAdmin, verifyAdminPassword)

//paintings
//GET
routes.get('/paintings', auth, isAdmin, getAllPaintings)
routes.get('/paintings/pending', auth, isAdmin, getPendingPaintings)
routes.get('/paintings/approve', auth, isAdmin, getApprovePaintings)
routes.get('/paintings/reject', auth, isAdmin, getRejectPaintings)

//PATCH, PUT
routes.patch('/paintings/:painting_id/handle', auth, isAdmin, statusHandlePainting)

//DELETE
routes.delete('/paintings/:painting_id/delete', auth, isAdmin, deletePainting)

module.exports = routes;