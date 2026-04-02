import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
    BusinessName : {
        type : String,
        required : true,
        trim : true,
        maxlength: 100
    },
    description : {
        type : String,
        maxlength : 300,
        trim : true
    },
    email: {
        type : String,
        required : true,
        unique : true,
        trim : true
    },

    phoneNumber : {
        type : String,
        required : true,
        trim : true
    }
}, {
    timestamps: true,
})


export default mongoose.models.Business || mongoose.model("Business", businessSchema)


