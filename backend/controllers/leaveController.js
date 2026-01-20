import Leave from "../models/Leave.js"
import Employee from '../models/Employee.js'

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

        const newLeave = new Leave({
            employeeId: employee._id,
            company: req.user.company._id,
            leaveType,
            startDate,
            endDate,
            reason
        });

        await newLeave.save();
        return res.status(200).json({success: true});
    } catch (error) {
        return res.status(500).json({success: false, error: "Leave add server error"});
    }
}

const getLeave = async (req, res) => {
    try {
        const {id, role} = req.params;
        let leaves;
        if (role === "admin") {
            leaves = await Leave.find({employeeId: id, company: req.user.company._id})
        } else {
            const employee = await Employee.findOne({userId: id})
            leaves = await Leave.find({employeeId: employee._id, company: req.user.company._id})
        }
        return res.status(200).json({success: true, leaves})
    } catch (error) {
        return res.status(500).json({success: false, error: "Leave add server error"});
    }
}
const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({company: req.user.company._id}).populate({
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
        return res.status(500).json({success: false, error: "Leaves add server error"});
    }
}
const getLeaveDetail = async (req, res) => {
    try {
        const {id} = req.params;
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

        if (leave && leave.company && leave.company.toString() !== req.user.company._id.toString()) {
            return res.status(403).json({success: false, error: "Access Denied: Leave belongs to another company"});
        }

        return res.status(200).json({success: true, leave})
    } catch (error) {
        return res.status(500).json({success: false, error: "Leaves detail server error"});
    }
}

const updateLeave = async (req, res) => {
    try {
        const {id} = req.params;
        const leaveCheck = await Leave.findById(id);
        if (leaveCheck && leaveCheck.company && leaveCheck.company.toString() !== req.user.company._id.toString()) {
            return res.status(403).json({success: false, error: "Access Denied: Leave belongs to another company"});
        }

        const leave = await Leave.findByIdAndUpdate(id, {status: req.body.status})
        if (! leave) {
            return res.status(404).json({success: false, error: "Leaves not found"});
        }
        return res.status(200).json({success: true})
    } catch (error) {
        return res.status(500).json({success: false, error: "Leaves update server error"});
    }
}

export {
    addLeave,
    getLeaves,
    getLeave,
    getLeaveDetail,
    updateLeave
}
