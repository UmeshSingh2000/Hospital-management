const express = require('express');
const AuthenticateToken = require('../Middlewares/AuthenticateToken');
const { getAllFloors } = require('../Controllers/floorController');
const { getAllRooms } = require('../Controllers/roomController');
const { getAllBeds, getAvailableBeds, getOccupiedBeds, assignedBedToPatient } = require('../Controllers/bedController');
const { createNewPatient, getAllPatients, getUnOccupiedPatients } = require('../Controllers/patientController');
const router = express.Router();


router.get('/getAllFloors',AuthenticateToken,getAllFloors);
router.get('/getAllRooms',AuthenticateToken,getAllRooms);
router.get('/getAllBeds',AuthenticateToken,getAllBeds);
router.get('/getAvailableBeds',AuthenticateToken,getAvailableBeds)
router.get('/getOccupiedBeds',AuthenticateToken,getOccupiedBeds)


router.post('/createNewPatient',AuthenticateToken,createNewPatient)
router.get('/getAllPatients',AuthenticateToken,getAllPatients)
router.get('/getUnOccupiedPatients',AuthenticateToken,getUnOccupiedPatients)
router.post('/assignedBedToPatient',AuthenticateToken,assignedBedToPatient)

module.exports = router;