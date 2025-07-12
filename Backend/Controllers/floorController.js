const Floor = require('../Database/Model/floorSchema')
const createFloor = async (req, res) => {
    try {
        const { floorNumber } = req.body;

        if (!floorNumber) {
            return res.status(400).json({ message: 'Floor number is required' });
        }
        const existingFloor = await Floor.findOne({ floorNumber });
        if (existingFloor) {
            return res.status(400).json({ message: 'Floor already exists' });
        }
        const newFloor = new Floor({
            floorNumber
        });

        await newFloor.save();
        res.status(201).json({ message: 'Floor created successfully', floor: newFloor });
    } catch (error) {
        res.status(500).json({ message: 'Error creating floor', error: error.message });
    }
}

const getAllFloors = async (req, res) => {
    try {
        const floors = await Floor.find();
        res.status(200).json({ floors });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching floors', error: error.message });
    }
}




module.exports = {
    createFloor,
    getAllFloors
};