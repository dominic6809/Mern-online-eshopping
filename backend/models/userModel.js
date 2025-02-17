import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        // minlength: 6,
        maxlength: 20
    },
    email : {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password : {
        type: String,
        required: true,
        // minlength: 8
    },
    isAdmin : {
        type: Boolean,
        required: true,
        default: false
    },
},
{
    timestamps: true,
}
);

const User = mongoose.model('User', userSchema);

export default User;