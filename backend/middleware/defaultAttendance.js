import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const defaultAttendance = async (req, res, next) => {
    try {
        const {date} = req.query;
        const queryDate = date || new Date().toISOString().split("T")[0];
        const existingAttendance = await Attendance.findOne({date: queryDate, company: req.user.company._id});

        if (! existingAttendance) {
            const employees = await Employee.find({company: req.user.company._id});
            const attendance = employees.map(employee => ({date: queryDate, employeeId: employee._id, company: req.user.company._id, status: null}));

            await Attendance.insertMany(attendance);
        }
        next();
    } catch (error) {
        console.error("Default attendance error:", error);
        res.status(500).json({success: false, error: error.message});
    }
};

export default defaultAttendance;
