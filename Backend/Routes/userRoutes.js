const express = require('express');
const AuthenticateToken = require('../Middlewares/AuthenticateToken');
const { getAllFloors } = require('../Controllers/floorController');
const { getAllRooms } = require('../Controllers/roomController');
const { getAllBeds } = require('../Controllers/bedController');
const router = express.Router();


router.get('/getAllFloors',AuthenticateToken,getAllFloors);
router.get('/getAllRooms',AuthenticateToken,getAllRooms);
router.get('/getAllBeds',AuthenticateToken,getAllBeds);

module.exports = router;