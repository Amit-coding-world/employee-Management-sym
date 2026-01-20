import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const getSummary = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments({company: req.user.company._id});
        const totalDepartments = await Department.countDocuments({company: req.user.company._id});

        const totalSalaries = await Employee.aggregate([
            {
                $match: {
                    company: req.user.company._id
                }
            }, {
                $group: {
                    _id: null,
                    totalSalary: {
                        $sum: "$salary"
                    }
                }
            },
        ]);

        const leaveStatus = await Leave.aggregate([
            {
                $lookup: {
                    from: "employees",
                    localField: "employeeId",
                    foreignField: "_id",
                    as: "employee"
                }
            }, {
                $unwind: "$employee"
            }, {
                $match: {
                    "employee.company": req.user.company._id
                }
            }, {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            },
        ]);

        const leaveSummary = {
            appliedFor: leaveStatus.reduce(
                (acc, curr) => acc + curr.count,
                0
            ),
            approved: leaveStatus.find((item) => item._id === "Approved") ?. count || 0,
            rejected: leaveStatus.find((item) => item._id === "Rejected") ?. count || 0,
            pending: leaveStatus.find((item) => item._id === "Pending") ?. count || 0
        };
        return res.status(200).json({
            success: true,
            totalEmployees,
            totalDepartments,
            totalSalary: totalSalaries[0] ?. totalSalary || 0,
            leaveSummary
        });
    } catch (error) {
        return res.status(500).json({success: false, error: "dashboard summary error"});
    }
};

export {
    getSummary
};
