const Room = require('../Database/Model/roomSchema');

// Create a new room
const createRoom = async (req, res) => {
    try {
        //floor is id
        const { roomNumber, type, floor, numberOfBeds } = req.body;

        const existingRoom = await Room.findOne({ roomNumber, floor });
        if (existingRoom) {
            return res.status(400).json({ message: 'Room already exists' });
        }

        const newRoom = new Room({
            roomNumber,
            type,
            floor,
            numberOfBeds
        });

        await newRoom.save();
        res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
        res.status(500).json({ message: 'Error creating room', error: error.message });
    }
};

// Get all rooms
const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error: error.message });
    }
};

// Get a single room by ID
const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching room', error: error.message });
    }
};

// Update a room
const updateRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const { roomNumber, type, floor, numberOfBeds, isOccupied } = req.body;

        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            { roomNumber, type, floor, numberOfBeds, isOccupied },
            { new: true, runValidators: true }
        );

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room updated successfully', room: updatedRoom });
    } catch (error) {
        res.status(500).json({ message: 'Error updating room', error: error.message });
    }
};

// Delete a room
const deleteRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRoom = await Room.findByIdAndDelete(id);

        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room', error: error.message });
    }
};

// Get all available (unoccupied) rooms
const getAvailableRooms = async (req, res) => {
    try {
        const availableRooms = await Room.find({ isFull: false });
        res.status(200).json({ availableRooms });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available rooms', error: error.message });
    }
};

module.exports = {
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    getAvailableRooms
};
