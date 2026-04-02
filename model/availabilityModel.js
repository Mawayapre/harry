import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        unique: true 
    },
    workingDays: {
        type: [Number], 
        default: [1, 2, 3, 4, 5]
    },
    start: {
        type: String, 
        required: true
    },
    end: {
        type: String, 
        required: true
    },
    break: {
        start: { type: String, default: "12:00" },
        end: { type: String, default: "13:00" }
    },
    slotDuration: {
        type: Number, 
        default: 30
    },
    offDates: {
        type: [Date], 
        default: []
    }
}, { timestamps: true });

const Availability = mongoose.models.Availability || mongoose.model('Availability', availabilitySchema);
export default Availability;