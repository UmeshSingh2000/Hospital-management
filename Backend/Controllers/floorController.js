const Floor = require('../Database/Model/floorSchema')
const createFloor = async (req, res) => {
    try {
        const { floorNumber, description } = req.body;

        if (!floorNumber || !description) {
            return res.status(400).json({ message: 'Floor number and description are required' });
        }

        const newFloor = new Floor({
            floorNumber,
            description
        });

        await newFloor.save();
        res.status(201).json({ message: 'Floor created successfully', floor: newFloor });
    } catch (error) {
        res.status(500).json({ message: 'Error creating floor', error: error.message });
    }
}
module.exports = {
    createFloor
};