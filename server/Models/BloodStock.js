const bloodSchema = new mongoose.Schema({
    BU_ID: {
        type: String,
        unique: true,
        required: true
    },
    Donor_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donor',
        required: true
    },
    BloodGroup: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    Expiry_Date: {
        type: Date,
        required: true
    },
    Status: {
        type: String,
        enum: ['Available', 'Unavailable'],
        default: 'Available'
    },
    Inventory_status: {
        type: String,
        required: true
    },
    Operating_Hours: {
        type: String,
        required: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Blood', bloodSchema);
