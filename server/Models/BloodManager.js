const mongoose = require('mongoose');

const bloodManagerSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Contact: {
        type: String,
        required: true
    },
    BM_ID: {
        type: String,
        unique: true,
        required: true
    },
    hired_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('BloodManager', bloodManagerSchema);
