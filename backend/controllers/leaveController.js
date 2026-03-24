import Leave from "../models/Leave.js"
import Employee from '../models/Employee.js'
import mongoose from "mongoose"

const getCompanyId = (user) => {
    if (!user || !user.company) return null;
    return user.company._id || user.company;
};

const addLeave = async (req, res) => {
    try {
        const {
            userId,
            leaveType,
            startDate,
            endDate,
            reason
        } = req.body;

        const employee = await Employee.findOne({userId});
        if (!employee) {
            return res.status(404).json({success: false, error: "Employee document not found for this user"});
        }

        const userCompanyId = getCompanyId(req.user);
        const newLeave = new Leave({
            employeeId: employee._id,
            company: userCompanyId,
            leaveType,
            startDate,
            endDate,
            reason
        });

        await newLeave.save();
        return res.status(200).json({success: true});
    } catch (error) {
        console.error("addLeave Error:", error);
        return res.status(500).json({success: false, error: error.message || "Leave add server error"});
    }
}

const getLeave = async (req, res) => {
    try {
        const {id, role} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, error: "Invalid ID format"});
        }
        
        const userCompanyId = getCompanyId(req.user);
        let leaves;

        // Determine if this is a personal view (using userId) or management view (using employeeId)
        // If the ID matches user._id, it's definitely a personal view.
        if (id === req.user._id.toString()) {
            const employee = await Employee.findOne({userId: id});
            if (!employee) {
                return res.status(200).json({success: true, leaves: []});
            }
            leaves = await Leave.find({employeeId: employee._id, company: userCompanyId});
        } else if (role === "admin" || role === "manager") {
            // Admin or Manager viewing an employee (id is employee._id)
            leaves = await Leave.find({employeeId: id, company: userCompanyId});
        } else {
            // Catch-all for other roles viewing self by userId
            const employee = await Employee.findOne({userId: id});
            if (!employee) {
                return res.status(200).json({success: true, leaves: []});
            }
            leaves = await Leave.find({employeeId: employee._id, company: userCompanyId});
        }
        return res.status(200).json({success: true, leaves})
    } catch (error) {
        console.error("getLeave Error:", error);
        return res.status(500).json({success: false, error: error.message || "Leave get server error"});
    }
}

const getLeaves = async (req, res) => {
    try {
        const userCompanyId = getCompanyId(req.user);
        const leaves = await Leave.find({company: userCompanyId}).populate({
            path: "employeeId",
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                }, {
                    path: 'userId',
                    select: 'name'
                }
            ]
        })
        return res.status(200).json({success: true, leaves})
    } catch (error) {
        console.error("getLeaves Error:", error);
        return res.status(500).json({success: false, error: error.message || "Leaves add server error"});
    }
}

const getLeaveDetail = async (req, res) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, error: "Invalid ID format"});
        }
        const leave = await Leave.findById(id).populate({
            path: "employeeId",
            populate: [
                {
                    path: 'department',
                    select: 'dep_name'
                }, {
                    path: 'userId',
                    select: 'name profileImage'
                }
            ]
        })

        const userCompanyId = getCompanyId(req.user);
        if (leave && leave.company && userCompanyId && leave.company.toString() !== userCompanyId.toString()) {
            return res.status(403).json({success: false, error: "Access Denied"});
        }

        return res.status(200).json({success: true, leave})
    } catch (error) {
        console.error("getLeaveDetail Error:", error);
        return res.status(500).json({success: false, error: error.message || "Leaves detail server error"});
    }
}

const updateLeave = async (req, res) => {
    try {
        const {id} = req.params;
        const {status} = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({success: false, error: "Invalid ID format"});
        }

        const leave = await Leave.findById(id);
        if (! leave) {
            return res.status(404).json({success: false, error: "leave not found"});
        }

        const userCompanyId = getCompanyId(req.user);
        if (leave.company && userCompanyId && leave.company.toString() !== userCompanyId.toString()) {
            return res.status(403).json({success: false, error: "Access Denied - Cross Company"});
        }

        // Single-tier: Only Admins can approve or reject.
        if (req.user.role !== 'admin') {
            return res.status(403).json({success: false, error: "Access Denied - Admin Only Approval"});
        }

        if (status !== 'Approved' && status !== 'Rejected') {
            return res.status(400).json({success: false, error: "Invalid status transition"});
        }

        await Leave.findByIdAndUpdate(id, {status});
        return res.status(200).json({success: true});
    } catch (error) {
        console.error("updateLeave Error:", error);
        return res.status(500).json({success: false, error: error.message || "leave update server error"});
    }
};

export {
    addLeave,
    getLeaves,
    getLeave,
    getLeaveDetail,
    updateLeave
}
