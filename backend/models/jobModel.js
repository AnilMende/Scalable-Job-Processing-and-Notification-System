import mongoose from "mongoose";

const jobSchema =  new mongoose.Schema({

    userId : {
        type : String,
        required : true
    },
    status : {
        enum : ["pending", "processing", "completed", "failed"],
        default : "pending"
    },
    attempts : {
        type : Number,
    },
    result : {
        type : String,
    },
    failedReason : {
        type : String
    }
});

export const Job = mongoose.model("JOB", jobSchema);