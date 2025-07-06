const mongoose = require('mongoose');
const { Schema } = mongoose;

const floorSchema = new Schema({
    floorNumber: {
        type: Number,
        required: [true, 'Floor number is required'],
        unique: true,
        min: [0, 'Floor number cannot be negative']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// Optional: Indexes for better search performance
// floorSchema.index({ floorNumber: 1 });
const Floor = mongoose.model('Floor', floorSchema);
module.exports = Floor;