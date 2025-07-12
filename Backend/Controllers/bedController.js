const Bed = require('../Database/Model/bedSchema');
const Room = require('../Database/Model/roomSchema');
const Patient = require('../Database/Model/patientSchema');
const createBed = async (req, res) => {
  try {
    const { bedNumber, roomId } = req.body;

    // Validate input
    if (!bedNumber || !roomId) {
      return res.status(400).json({ message: 'Bed number and Room ID are required.' });
    }

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }

    // Check if room is full
    if (room.numberOfBeds >= room.totalBedOccupancy) {
      return res.status(400).json({ message: 'Cannot add more beds, room is full.' });
    }

    // Check if the same bed number exists in this room
    const existingBed = await Bed.findOne({ bedNumber, roomId });
    if (existingBed) {
      return res.status(409).json({ message: 'Bed number already exists in this room.' });
    }

    // Create and save new bed
    const newBed = new Bed({ bedNumber, roomId });
    await newBed.save();

    // Update room's bed count
    room.numberOfBeds += 1;
    if (room.numberOfBeds === room.totalBedOccupancy) {
      room.isFull = true;
    }
    await room.save();

    return res.status(201).json({
      message: 'Bed created successfully',
      bed: newBed
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Bed number already exists.' });
    }

    res.status(500).json({ message: 'Error creating bed', error: error.message });
  }
};

const getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.find().populate({
      path: 'roomId',
      select: 'roomNumber type floorId',
      populate: {
        path: 'floorId',
        select: 'floorNumber'
      }
    }); // Populate room details
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching beds', error: error.message });
  }
};

const getBedByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const beds = await Bed.find({ roomId })
      .populate('patientId', 'name age gender') // select fields you want
      .populate('occupancyHistory.patient', 'name age gender');

    if (!beds || beds.length === 0) {
      return res.status(404).json({ message: 'No beds found for this room.' });
    }

    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching beds for the room',
      error: error.message
    });
  }
};



const getAvailableBeds = async (req, res) => {
  try {
    const beds = await Bed.find({ isOccupied: false }).populate({
      path: 'roomId',
      select: 'roomNumber type floorId',
      populate: {
        path: 'floorId',
        select: 'floorNumber'
      }
    });
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available beds', error: error.message });
  }
};

const getOccupiedBeds = async (req, res) => {
  try {
    const beds = await Bed.find({ isOccupied: true }).populate({
      path: 'roomId',
      select: 'roomNumber type floorId',
      populate: {
        path: 'floorId',
        select: 'floorNumber'
      }
    })
      .populate({
        path: 'patientId',
        select: 'name age contactNumber',
        populate: {
          path: 'doctorAssigned',
          select: 'name email'
        }
      })
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching occupied beds', error: error.message });
  }
};

const assignedBedToPatient = async (req, res) => {
  try {
    const { bedId, patientId } = req.body;

    // Validate input
    if (!bedId || !patientId) {
      return res.status(400).json({ message: 'Bed ID and Patient ID are required.' });
    }
    const isPatient = await Patient.findById(patientId);
    if (!isPatient) {
      return res.status(404).json({ message: 'Patient not found.' });
    }
    if (isPatient.isAssignedBed) {
      return res.status(400).json({ message: 'Patient already has an assigned bed.' });
    }
    // Find the bed
    const bed = await Bed.findById(bedId);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found.' });
    }

    // Check if the bed is already occupied
    if (bed.isOccupied) {
      return res.status(400).json({ message: 'Bed is already occupied.' });
    }

    // Assign the bed to the patient
    bed.isOccupied = true;
    bed.patientId = patientId;
    isPatient.isAssignedBed = true;
    bed.occupancyHistory.push({
      patient: patientId,
      from: new Date(),
      to: null // To be updated when the bed is cleared
    });
    await bed.save();
    await isPatient.save();

    return res.status(200).json({
      message: 'Bed assigned to patient successfully',
      bed
    });

  } catch (error) {
    res.status(500).json({ message: 'Error assigning bed', error: error.message });
  }
};

const clearBed = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Bed ID is required.' });
    }

    const bed = await Bed.findById(id);
    if (!bed) {
      return res.status(404).json({ message: 'Bed not found.' });
    }

    if (!bed.isOccupied) {
      return res.status(400).json({ message: 'Bed is not occupied.' });
    }

    // Find the patient linked to the bed
    const patient = await Patient.findById(bed.patientId);
    if (patient) {
      patient.isAssignedBed = false;
      await patient.save();
    }

    bed.isOccupied = false;
    bed.patientId = null;

    // Update occupancy history
    const lastOccupancy = bed.occupancyHistory[bed.occupancyHistory.length - 1];
    if (lastOccupancy && !lastOccupancy.to) {
      lastOccupancy.to = new Date();
    }

    await bed.save();

    return res.status(200).json({ message: 'Bed cleared successfully' });

  } catch (error) {
    return res.status(500).json({ message: 'Error clearing bed', error: error.message });
  }
};


module.exports = {
  createBed,
  getAllBeds,
  getAvailableBeds,
  getOccupiedBeds,
  assignedBedToPatient,
  clearBed,
  getBedByRoom
};
