import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import upload from "../middleware/cloudinaryUpload.js";
import Department from '../models/Department.js'
import mongoose from "mongoose";

const getCompanyId = (user) => {
    if (!user || !user.company) return null;
    return user.company._id || user.company;
};

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

        const userCompanyId = getCompanyId(req.user);
        if (!userCompanyId) {
             return res.status(400).json({success: false, error: "Company context missing"});
        }

        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({success: false, error: "Email already registered"});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        let profileImageUrl = '';
        if (req.file && req.file.path) {
            profileImageUrl = req.file.path;
        } else if (req.file && req.file.url) {
            profileImageUrl = req.file.url;
        }

        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
            profileImage: profileImageUrl,
            company: userCompanyId
        });

        const savedUser = await newUser.save();

        const newEmployee = new Employee({
            userId: savedUser._id,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            company: userCompanyId
        });
        await newEmployee.save();
        return res.status(200).json({success: true, message: "Employee Created Successfully"})
    } catch (error) {
        console.error("addEmployee Error:", error);
        return res.status(500).json({success: false, error: error.message || "Server error in adding employee"})
    }
};

const getEmployees = async (req, res) => {
    try {
        const userCompanyId = getCompanyId(req.user);
        const employees = await Employee.find({company: userCompanyId}).populate('userId', {password: 0}).populate("department");
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
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, error: "Invalid ID format"});
        }

        const userCompanyId = getCompanyId(req.user);
        let employee;
        employee = await Employee.findById(id).populate('userId', {password: 0}).populate("department");

        if (! employee) {
            employee = await Employee.findOne({userId: id}).populate('userId', {password: 0}).populate("department");
        }

        if (employee && employee.company && userCompanyId && employee.company.toString() !== userCompanyId.toString()) {
            return res.status(403).json({success: false, error: "Access Denied"});
        }

        return res.status(200).json({success: true, employee});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "get employee detail server error"
        });
    }
}

const updateEmployee = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, error: "Invalid ID format"});
        }

        const {
            name,
            maritalStatus,
            designation,
            department,
            salary
        } = req.body;

        const employee = await Employee.findById(id);
        if (! employee) {
            return res.status(404).json({success: false, error: "employee not found"});
        }

        const userCompanyId = getCompanyId(req.user);
        if (employee.company && userCompanyId && employee.company.toString() !== userCompanyId.toString()) {
            return res.status(403).json({success: false, error: "Access Denied"});
        }

        const user = await User.findById(employee.userId);
        if (! user) {
            return res.status(404).json({success: false, error: "user not found"});
        }

        let profileImageUrl = user.profileImage;
        if (req.file && req.file.path) {
            profileImageUrl = req.file.path;
        } else if (req.file && req.file.url) {
            profileImageUrl = req.file.url;
        }

        await User.findByIdAndUpdate(employee.userId, {
            name,
            profileImage: profileImageUrl
        })
        await Employee.findByIdAndUpdate(id, {
            maritalStatus,
            designation,
            salary,
            department
        })

        return res.status(200).json({success: true, message: "employee update"});
    } catch (error) {
        return res.status(500).json({success: false, error: error.message || "update employees server error"})
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
            error: error.message || "fetch employees by department failed"
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
