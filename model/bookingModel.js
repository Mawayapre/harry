import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    date: {
        type: Date, 
        required: true
    },
    slot: {
        type: String, 
        required: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed'
    }
}, { timestamps: true });

bookingSchema.index({ businessId: 1, date: 1, slot: 1 }, { unique: true });


const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;