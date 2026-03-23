import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            "admin", "manager", "employee"
        ],
        required: true
    },
    profileImage: {
        type: String
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    resetOtp: {
        type: String
    },
    resetOtpExpiry: {
        type: Date
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("User", userSchema);
export default User;
