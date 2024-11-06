const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Contact: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    BloodGroup: {
        type: String,
        required: true
    },
    HealthStatus: {
        type: String,
        required: true
    },
    Age: {
        type: Number,
        required: true
    },
    Records: [
        {
            Date: { type: Date, required: true },
            Details: { type: String, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Donor', donorSchema);
