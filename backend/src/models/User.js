//redeploy trigger
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    dateOfBirth : {
        type : Date,
        required : true
    },
    mobileNumber : {
        type : String,
        required : true,
        unique : true,
        index : true
    },
    profileImage : {    
        type : String,
        default : ""
    },
    pushTokens : {    
        type : String,
        default : ""
    }
}, { timestamps: true }
);

//hash password before saving user to db

// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("User", userSchema);
export default User;