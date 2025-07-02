const createBed = async (req, res) => {
    try {
        const { roomId, bedNumber } = req.body;

        // Check if the room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if the bed already exists in the room
        const existingBed = await Bed.findOne({ room: roomId, bedNumber });
        if (existingBed) {
            return res.status(400).json({ message: 'Bed with this number already exists in this room' });
        }

        const newBed = new Bed({
            room: roomId,
            bedNumber,
        });

        await newBed.save();
        res.status(201).json({ message: 'Bed created successfully', bed: newBed });
    } catch (error) {
        res.status(500).json({ message: 'Error creating bed', error: error.message });
    }
}