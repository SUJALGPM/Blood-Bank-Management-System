const doneeSchema = new mongoose.Schema({
    Name: {
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
    HealthStatus: {
        type: String,
        required: true
    },
    BloodGroup: {
        type: String,
        required: true
    },
    Donee_ID: {
        type: String,
        unique: true,
        required: true
    },
    Request_date: {
        type: Date,
        required: true
    },
    Records: [
        {
            Date: { type: Date, required: true },
            Detail: { type: String, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Donee', doneeSchema);
    