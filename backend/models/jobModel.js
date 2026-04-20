import mongoose from "mongoose";

const jobSchema =  new mongoose.Schema({

    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String,
        enum : ["pending", "processing", "completed", "failed"],
        default : "pending"
    },
    attempts : {
        type : Number,
        default : 0
    },
    result : {
        type : String,
    },
    failedReason : {
        type : String
    }
});

export const Job = mongoose.model("Job", jobSchema);