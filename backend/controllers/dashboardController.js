import Department from "../models/Department.js";
import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";

const getCompanyId = (user) => {
    if (!user || !user.company) return null;
    return user.company._id || user.company;
};

const getSummary = async (req, res) => {
    try {
        const userCompanyId = getCompanyId(req.user);
        if (!userCompanyId) {
            return res.status(400).json({success: false, error: "Company context missing"});
        }

        const totalEmployees = await Employee.countDocuments({company: userCompanyId});
        const totalDepartments = await Department.countDocuments({company: userCompanyId});

        const totalSalaries = await Employee.aggregate([
            {
                $match: {
                    company: userCompanyId
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
                $match: {
                    company: userCompanyId
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
            pending: (leaveStatus.find((item) => item._id === "Pending") ?. count || 0) + 
                     (leaveStatus.find((item) => item._id === "Manager Approved") ?. count || 0)
        };

        return res.status(200).json({
            success: true,
            totalEmployees,
            totalDepartments,
            totalSalary: totalSalaries[0] ?. totalSalary || 0,
            leaveSummary
        });
    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        return res.status(500).json({success: false, error: "dashboard summary error"});
    }
};

export {
    getSummary
};
