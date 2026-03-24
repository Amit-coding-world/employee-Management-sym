import Salary from "../models/Salary.js";
import Employee from "../models/Employee.js";
import mongoose from "mongoose";

const getCompanyId = (user) => {
    if (!user || !user.company) return null;
    return user.company._id || user.company;
};

const addSalary = async (req, res) => {
    try {
        const {
            employeeId,
            basicSalary,
            allowances,
            deductions,
            payDate
        } = req.body;

        const netSalary = parseInt(basicSalary) + parseInt(allowances) - parseInt(deductions);
        
        const userCompanyId = getCompanyId(req.user);
        const newSalary = await Salary({
            employeeId,
            company: userCompanyId,
            basicSalary,
            allowances,
            deductions,
            payDate,
            netSalary: netSalary
        });

        await newSalary.save();
        return res.status(200).json({success: true});
    } catch (error) {
        console.error("addSalary Error:", error);
        return res.status(500).json({success: false, error: error.message || "salary add server error"});
    }
};

const getSalary = async (req, res) => {
    try {
        const {id, role} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, error: "Invalid ID format"});
        }

        const userCompanyId = getCompanyId(req.user);
        let salary;

        // If the ID matches user._id, it's definitely a personal view using userId.
        if (id === req.user._id.toString()) {
            const employee = await Employee.findOne({userId: id});
            if (!employee) {
                return res.status(200).json({success: true, salary: []});
            }
            salary = await Salary.find({employeeId: employee._id, company: userCompanyId}).populate("employeeId", "employeeId");
        } else if (role === "admin" || role === "manager") {
            // Admin or Manager viewing an employee using employee._id
            salary = await Salary.find({employeeId: id, company: userCompanyId}).populate("employeeId", "employeeId");
        } else {
            // Catch-all for other roles viewing self by userId
            const employee = await Employee.findOne({userId: id});
            if (!employee) {
                return res.status(200).json({success: true, salary: []});
            }
            salary = await Salary.find({employeeId: employee._id, company: userCompanyId}).populate("employeeId", "employeeId");
        }
        
        return res.status(200).json({success: true, salary});
    } catch (error) {
        console.error("getSalary Error:", error);
        return res.status(500).json({success: false, error: error.message || "salary get server error"});
    }
};

export {
    addSalary,
    getSalary
};
