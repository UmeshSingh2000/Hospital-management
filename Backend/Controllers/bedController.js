const Bed = require('../Database/Model/bedSchema');

const createBed = async (req, res) => {
    try {
        const { bedNumber, roomId } = req.body;

        // Validate input
        if (!bedNumber || !roomId) {
            return res.status(400).json({ message: 'Bed number and Room ID are required.' });
        }


        // Create a new bed
        const newBed = new Bed({
            bedNumber,
            roomId
        });

        // Save to DB
        await newBed.save();

        res.status(201).json({
            message: 'Bed created successfully',
            bed: newBed
        });

    } catch (error) {
        // Handle duplicate key error for bedNumber
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Bed number already exists.' });
        }

        res.status(500).json({ message: 'Error creating bed', error: error.message });
    }
};

module.exports = {
    createBed
};
