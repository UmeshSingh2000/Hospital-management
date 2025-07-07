const Patient = require('../Database/Model/patientSchema')
// done by receptionist
const createNewPatient = async (req, res) => {
    try {
        const { name, age, gender, contactNumber, address, medicalHistory } = req.body
        if (!name || !age || !gender || !contactNumber || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newPatient = new Patient({
            name,
            age,
            gender,
            contactNumber,
            address,
            medicalHistory
        });
        const savedPatient = await newPatient.save();
        res.status(201).json({ message: 'Patient created successfully', patient: savedPatient });

    } catch (error) {
        res.status(500).json({ message: 'Error creating patient', error: error.message });
    }
}

const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('doctorAssigned', 'name email');;
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error: error.message });
    }
}

module.exports = {
    createNewPatient,
    getAllPatients
}