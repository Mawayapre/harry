import mongoose from 'mongoose';


const serviceSchema = new mongoose.Schema({
    business : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Business',
        required : true
    }, 
    name : {
        type : String,
        required : true,
        trim : true,
        maxlength : 50
    },

    price :{
        type : String,
        required : true
    },

    duration : {
        type : String,
    },

    description : {
        type : String ,
        required : true,
        maxlength: 200
    }

},{
    timestamps : true
})


export default mongoose.models.Service || mongoose.model("Service", serviceSchema)