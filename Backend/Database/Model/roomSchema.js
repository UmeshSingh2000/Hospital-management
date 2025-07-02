const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema(
    {
        roomNumber: {
            type: String,
            required: [true, 'Room number is required'],
            unique: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['General', 'Semi-Private', 'Private', 'ICU', 'Operation Theater'],
            required: [true, 'Room type is required']
        },
        floor: {
            type: Schema.Types.ObjectId,
            ref: 'Floor', // Assuming Floor model is used for floors
            required: [true, 'Floor is required']
        },
        numberOfBeds: {
            type: Number,
            required: [true, 'Number of beds is required'],
            min: [1, 'At least one bed is required'],
            max: [10, 'Maximum of 10 beds allowed per room']
        },
        isFull: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Optional: Indexes
roomSchema.index({ roomNumber: 1 });

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
