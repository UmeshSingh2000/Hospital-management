const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be less than 100 characters']
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [0, 'Age cannot be negative'],
      max: [120, 'Age seems unrealistic']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required']
    },
    contactNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 format
        },
        message: props => `${props.value} is not a valid phone number!`
      },
      required: [true, 'Contact number is required']
    },
    address: {
      type: String,
      trim: true
    },
    medicalHistory: {
      type: [String], // Array of strings for simplicity
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    },
    doctorAssigned: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assuming User model is used for doctors
      // required: [true, 'Doctor assigned is required']
    },
  },
  {
    timestamps: true
  }
);

// Optional: Indexing for faster search on name or contact
// patientSchema.index({ name: 1 });
// patientSchema.index({ contactNumber: 1 });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;