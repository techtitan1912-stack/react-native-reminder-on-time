import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    mentionNumber : {
        type : [String],
        default : []
    }, 
    mentionedUserNames : {
        type : [String],
        default : []
    }, 
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    reminderTime : {
        type : Date,
    },
    isCompleted : {
        type : Boolean,
        default : false
    },
    isViewed : {
        type : Boolean,
        default : false
    },
    completedAt : {
        type : Date,
        default : null
    },
}, {timestamps: true});

// ✅ TTL INDEX (Auto delete after 3 days)
taskSchema.index(
    { completedAt: 1 },
    { expireAfterSeconds: 3 * 24 * 60 * 60 }
);


const Task = mongoose.model("Task", taskSchema);
export default Task;