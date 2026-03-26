const mongoose = require('mongoose');

const diseaseReportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    prediction: {
        type: String,
        default: 'Unknown'
    },
    advice: {
        type: String,
        default: 'No advice available.'
    }
}, { timestamps: true });

module.exports = mongoose.model('DiseaseReport', diseaseReportSchema);
