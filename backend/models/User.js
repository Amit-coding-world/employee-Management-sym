import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    // In Mongoose, a schema is a blueprint for MongoDB documents that defines field names, data types, validation rules, and structure.
    name: {
        type: String,
        required: true
    },
    email: {
        type: String, // js support string type,an email is stored as a string
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // basic email regex
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
        type: String, // URL to the profile image
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    resetOtp: {
        type: String, // OTP for password reset
    },
    resetOtpExpiry: {
        type: Date, // OTP expiry time
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
