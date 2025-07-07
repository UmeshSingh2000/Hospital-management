const Bed = require('../Database/Model/bedSchema');
const Room = require('../Database/Model/roomSchema');
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
    });
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching occupied beds', error: error.message });
  }
};

module.exports = {
  createBed,
  getAllBeds,
  getAvailableBeds,
  getOccupiedBeds
};
