import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import upload from "../middleware/cloudinaryUpload.js";
import Department from '../models/Department.js'
import {error} from "console";


const addEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            password,
            role
        } = req.body;

        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({success: false, error: "user already registered in emp"});
        }

        const hashPassword = await bcrypt.hash(password, 10);


        // Debug log for file upload
        console.log('Uploaded file:', req.file);

        // Ensure Cloudinary URL is present
        let profileImageUrl = '';
        if (req.file && req.file.path) {
            profileImageUrl = req.file.path;
        } else if (req.file && req.file.url) {
            profileImageUrl = req.file.url;
        } else { // If no file uploaded, you can set a default image URL or return an error
            profileImageUrl = '';
            // Optionally, return error if image is required
            // return res.status(400).json({ success: false, error: 'Image upload failed' });
        }

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
            profileImage: profileImageUrl
        });

        // Debug log for profileImage value
        console.log('Profile image URL to save:', profileImageUrl);

        const savedUser = await newUser.save();

        const newEmployee = new Employee({
            userId: savedUser._id,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary
        });
        await newEmployee.save();
        return res.status(200).json({success: true, message: "employee created"})
    } catch (error) {
        return res.status(500).json({success: false, error: "server error in adding employee"})
    }
};

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('userId', {password: 0}).populate("department");
        return res.status(200).json({success: true, employees});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "get employees server error"
        });
    }
}
const getEmployee = async (req, res) => {
    const {id} = req.params;
    try {
        let employee;
        employee = await Employee.findById({_id: id}).populate('userId', {password: 0}).populate("department");

        if (! employee) {
            employee = await Employee.findOne({userId: id}).populate('userId', {password: 0}).populate("department");
        }

        return res.status(200).json({success: true, employee});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "get employees server error"
        });
    }
}

const updateEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        const {
            name,
            maritalStatus,
            designation,
            department,
            salary
        } = req.body;

        const employee = await Employee.findById({_id: id});
        if (! employee) {
            return res.status(404).json({success: false, error: "employee not found"});
        }
        const user = await User.findById({_id: employee.userId});
        if (! user) {
            return res.status(404).json({success: false, error: "user not found"});
        }

        let profileImageUrl = user.profileImage;
        if (req.file && req.file.path) {
            profileImageUrl = req.file.path;
        } else if (req.file && req.file.url) {
            profileImageUrl = req.file.url;
        }

        const updateUser = await User.findByIdAndUpdate({
            _id: employee.userId
        }, {name, profileImage: profileImageUrl})
        const updateEmployee = await Employee.findByIdAndUpdate({
            _id: id
        }, {maritalStatus, designation, salary, department})
        if (! updateEmployee || ! updateUser) {
            return res.status(404).json({success: false, error: "document  not found"});
        }
        return res.status(200).json({success: true, message: "employee update"});
    } catch (error) {
        return res.status(500).json({success: false, error: "update employees server error"})
    }
}

const fetchEmployeesByDepId = async (req, res) => {
    const {id} = req.params;
    try {
        const employees = await Employee.find({department: id})
        return res.status(200).json({success: true, employees});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "get employeesByDepId server error"
        });
    }
}

export {
    addEmployee,
    upload,
    getEmployees,
    getEmployee,
    updateEmployee,
    fetchEmployeesByDepId
};
