const mongoose = require('mongoose');
const { Schema } = mongoose;

const bedSchema = new Schema(
  {
    bedNumber: {
      type: String,
      required: [true, 'Bed number is required'],
      unique: true,
      trim: true,
      minlength: [1, 'Bed number must be at least 1 character'],
      maxlength: [10, 'Bed number must be less than 10 characters']
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room ID is required']
    },
    isOccupied: {
      type: Boolean,
      default: false
    },
    patientId: {
      type: Schema.Types.ObjectId, // currently assigned patient
      ref: 'Patient',
      default: null
    },
    occupancyHistory: [
      {
        patient: {
          type: Schema.Types.ObjectId,
          ref: 'Patient'
        },
        from: Date,
        to: Date
      }
    ],
  },
  {
    timestamps: true
  }
);

// Optional: Indexes for better search performance
bedSchema.index({ bedNumber: 1 });
bedSchema.index({ roomId: 1 });

const Bed = mongoose.model('Bed', bedSchema);
module.exports = Bed;
