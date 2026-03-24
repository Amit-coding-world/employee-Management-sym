import Department from "../models/Department.js";
import mongoose from "mongoose";

const getCompanyId = (user) => {
    if (!user || !user.company) return null;
    return user.company._id || user.company;
};

const getDepartments = async (req, res) => {
    try {
        const userCompanyId = getCompanyId(req.user);
        const departments = await Department.find({company: userCompanyId});
        return res.status(200).json({success: true, departments});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "get departments server error"
        });
    }
}

const addDepartment = async (req, res) => {
    try {
        const {dep_name, description} = req.body;
        const userCompanyId = getCompanyId(req.user);
        const newDep = new Department({dep_name, description, company: userCompanyId});
        await newDep.save();
        return res.status(200).json({success: true, department: newDep});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "add department server error"
        });
    }
}

const getDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, error: "Invalid ID format"});
        }
        const department = await Department.findById(id);
        const userCompanyId = getCompanyId(req.user);

        if (department && department.company && userCompanyId && department.company.toString() !== userCompanyId.toString()) {
            return res.status(403).json({success: false, error: "Access Denied"});
        }

        return res.status(200).json({success: true, department});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "get department server error"
        });
    }
}

const updateDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, error: "Invalid ID format"});
        }
        const {dep_name, description} = req.body;
        const userCompanyId = getCompanyId(req.user);
        const department = await Department.findById(id);

        if (department && department.company && userCompanyId && department.company.toString() !== userCompanyId.toString()) {
            return res.status(403).json({success: false, error: "Access Denied"});
        }

        await Department.findByIdAndUpdate(id, {dep_name, description});
        return res.status(200).json({success: true});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "update department server error"
        });
    }
}

const deleteDepartment = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, error: "Invalid ID format"});
        }
        const userCompanyId = getCompanyId(req.user);
        const department = await Department.findById(id);

        if (department && department.company && userCompanyId && department.company.toString() !== userCompanyId.toString()) {
            return res.status(403).json({success: false, error: "Access Denied"});
        }

        await Department.findByIdAndDelete(id);
        return res.status(200).json({success: true});
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || "delete department server error"
        });
    }
}

export {
    addDepartment,
    getDepartments,
    getDepartment,
    updateDepartment,
    deleteDepartment
};
