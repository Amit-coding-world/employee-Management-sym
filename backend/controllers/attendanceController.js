import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

const getCompanyId = (user) => {
    if (!user || !user.company) return null;
    return user.company._id || user.company;
};

const getAttendance = async (req, res) => {
    try {
        const {date} = req.query;
        const queryDate = date || new Date().toISOString().split("T")[0];
        const userCompanyId = getCompanyId(req.user);

        const attendance = await Attendance.find({date: queryDate, company: userCompanyId}).populate({
            path: "employeeId",
            populate: ["department", "userId"]
        });

        return res.status(200).json({success: true, attendance});
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return res.status(500).json({success: false, message: error.message});
    }
};

const updateAttendance = async (req, res) => {
    try {
        const {employeeId} = req.params;
        const {status, date} = req.body;
        const queryDate = date || new Date().toISOString().split('T')[0];
        const userCompanyId = getCompanyId(req.user);

        const employee = await Employee.findOne({employeeId});
        if (!employee) {
            return res.status(404).json({success: false, error: "Employee not found"});
        }

        const attendance = await Attendance.findOneAndUpdate({
            employeeId: employee._id,
            date: queryDate,
            company: userCompanyId
        }, {
            status
        }, {new: true, upsert: true}); // Use upsert if marking for the first time
        
        return res.status(200).json({success: true, attendance});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
};

const attendanceReport = async (req, res) => {
    try {
        const {
            date,
            employeeId,
            limit = 5,
            skip = 0
        } = req.query;
        const userCompanyId = getCompanyId(req.user);

        const query = {
            company: userCompanyId
        };
        if (date) {
            query.date = date;
        }
        if (employeeId) {
            query.employeeId = employeeId;
        }
        const attendanceDate = await Attendance.find(query).populate({
            path: "employeeId",
            populate: ["department", "userId"]
        }).sort({date: -1}).limit(parseInt(limit)).skip(parseInt(skip));

        const groupData = attendanceDate.reduce((result, record) => {
            if (!result[record.date]) {
                result[record.date] = [];
            }
            if (record.employeeId && record.employeeId.userId) {
                result[record.date].push({
                    employeeId: record.employeeId.employeeId,
                    employeeName: record.employeeId.userId.name,
                    departmentName: record.employeeId.department?.dep_name || "N/A",
                    status: record.status || "Not Marked"
                });
            }
            return result;
        }, {});
        return res.status(200).json({success: true, groupData});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
};

const getAttendanceByEmployeeId = async (req, res) => {
    try {
        const {id} = req.params;
        const date = new Date().toISOString().split("T")[0];
        const userCompanyId = getCompanyId(req.user);
        const attendance = await Attendance.findOne({employeeId: id, date, company: userCompanyId});
        return res.status(200).json({success: true, attendance});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
};

const getAttendanceByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const userCompanyId = getCompanyId(req.user);
        const employee = await Employee.findOne({userId});
        if (! employee) {
            return res.status(404).json({success: false, message: "Employee not found"});
        }
        const date = new Date().toISOString().split("T")[0];
        const attendance = await Attendance.findOne({employeeId: employee._id, date, company: userCompanyId});
        return res.status(200).json({success: true, attendance});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
};

export {
    getAttendance,
    updateAttendance,
    attendanceReport,
    getAttendanceByEmployeeId,
    getAttendanceByUser
};
