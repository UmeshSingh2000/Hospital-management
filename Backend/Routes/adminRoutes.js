const express = require('express');
const { createFloor } = require('../Controllers/floorController');
const { createRoom } = require('../Controllers/roomController');
const { createBed } = require('../Controllers/bedController');
const { loginUser, registerUser, getAllUsers } = require('../Controllers/userController');
const AuthenticateToken = require('../Middlewares/AuthenticateToken');
const isAdmin = require('../Middlewares/isAdmin');
const router = express.Router();


router.post('/login', loginUser)
router.post('/registerUser',AuthenticateToken, isAdmin, registerUser)
router.get('/getAllUsers',AuthenticateToken,isAdmin,getAllUsers)
router.post('/createFloor', AuthenticateToken, isAdmin, createFloor)

router.post('/createRoom', AuthenticateToken, isAdmin, createRoom)

router.post('/createBed', AuthenticateToken, isAdmin, createBed)

module.exports = router;