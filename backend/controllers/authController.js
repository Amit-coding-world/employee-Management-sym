import User from "../models/User.js";
import Company from "../models/Company.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email}).populate("company");
        if (! user) {
            return res.status(404).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (! isMatch) {
            return res.status(404).json({message: "Wrong Password"});
        }
        const token = jwt.sign({
            _id: user._id,
            role: user.role
        }, process.env.JWT_KEY, {expiresIn: '10d'});

        return res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                role: user.role,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        return res.status(500).json({success: false, error: error.message});
    }

}
const verify = async (req, res) => {
    return res.status(200).json({success: true, user: req.user});
}

const signup = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            companyName,
            companyDescription
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({success: false, error: "User already exists with this email"});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create company
        const company = new Company({
            name: companyName,
            description: companyDescription || ''
        });
        await company.save();

        // Create user with specified role
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'admin',
            company: company._id
        });
        await user.save();

        return res.status(201).json({
                success: true, message: `${
                role || 'Admin'
            } account created successfully`
        });

    } catch (error) {
        return res.status(500).json({success: false, error: error.message});
    }
}

const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;

        // Find user
        const user = await User.findOne({email});
        if (! user) {
            return res.status(404).json({success: false, error: "User not found with this email"});
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Set OTP expiry (10 minutes from now)
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP to user
        user.resetOtp = otp;
        user.resetOtpExpiry = otpExpiry;
        await user.save();

        // In production, send OTP via email
        // For now, we'll return it in the response (ONLY FOR DEVELOPMENT)
        console.log(`OTP for ${email}: ${otp}`);

        return res.status(200).json({
            success: true, message: `OTP sent to ${email}. Please check your email.`,
            // Remove this in production - only for development
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
        });

    } catch (error) {
        return res.status(500).json({success: false, error: error.message});
    }
}

const resetPassword = async (req, res) => {
    try {
        const {email, otp, newPassword} = req.body;

        // Find user
        const user = await User.findOne({email});
        if (! user) {
            return res.status(404).json({success: false, error: "User not found"});
        }

        // Check if OTP exists
        if (! user.resetOtp || ! user.resetOtpExpiry) {
            return res.status(400).json({success: false, error: "No OTP request found. Please request a new OTP."});
        }

        // Check if OTP is expired
        if (new Date() > user.resetOtpExpiry) {
            return res.status(400).json({success: false, error: "OTP has expired. Please request a new one."});
        }

        // Verify OTP
        if (user.resetOtp !== otp) {
            return res.status(400).json({success: false, error: "Invalid OTP"});
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP
        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        user.updatedAt = new Date();
        await user.save();

        return res.status(200).json({success: true, message: "Password reset successfully. You can now login with your new password."});

    } catch (error) {
        return res.status(500).json({success: false, error: error.message});
    }
}

export {
    login,
    verify,
    signup,
    forgotPassword,
    resetPassword
};
