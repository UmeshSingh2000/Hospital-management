const Patient = require('../Database/Model/patientSchema')
// done by receptionist
const createNewPatient = async (req, res) => {
    try {
        const { name, age, gender, contactNumber, address } = req.body
        if (!name || !age || !gender || !contactNumber || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newPatient = new Patient({
            name,
            age,
            gender,
            contactNumber,
            address,
        });
        const savedPatient = await newPatient.save();
        res.status(201).json({ message: 'Patient created successfully', patient: savedPatient });

    } catch (error) {
        res.status(500).json({ message: 'Error creating patient', error: error.message });
    }
}

const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().populate('doctorAssigned', 'name email');
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error: error.message });
    }
}

const getUnOccupiedPatients = async (req, res) => {
    try {
        const patients = await Patient.find({ isAssignedBed: false, doctorAssigned: null })
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error: error.message });
    }
}

const assigDoctorToPatient = async (req, res) => {
    try {
        const { id } = req.params //patient id
        const { doctorId } = req.body; //doctor id
        if (!doctorId) {
            return res.status(400).json({ message: 'Doctor ID is required' });
        }
        const patient = await Patient.findById(id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        if (patient.doctorAssigned) {
            return res.status(400).json({ message: 'Doctor already assigned to this patient' });
        }
        patient.doctorAssigned = doctorId;
        await patient.save();
        res.status(200).json({ message: 'Doctor assigned to patient successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning doctor to patient', error: error.message });
    }
}

module.exports = {
    createNewPatient,
    getAllPatients,
    getUnOccupiedPatients,
    assigDoctorToPatient
}