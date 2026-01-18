import React, {useEffect, useState} from "react";
import SummaryCard from "./SummaryCard.jsx";
import axios from "axios";
import {
    FaBuilding,
    FaCheckCircle,
    FaFileAlt,
    FaHourglassHalf,
    FaMoneyBillWave,
    FaTimesCircle,
    FaUsers
} from "react-icons/fa";

const AdminSummary = () => {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await axios.get(`https://employee-management-system-sbvn.onrender.com/api/dashboard/summary`, {
                    headers: {
                        Authorization: `Bearer ${
                            localStorage.getItem("token")
                        }`
                    }
                });
                setSummary(res.data);
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.error);
                }
                console.log(error.message);
            }
        };
        fetchSummary();
    }, []);

    if (!summary) {
        return <div className="p-6 text-center text-gray-600">
            Loading ...</div>;
    }

    return (
        <div className="p-4 sm:p-6 ">
            {/* Dashboard Overview */}
            <h3 className="text-xl sm:max-w-full font-bold">Dashboard Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                <SummaryCard icon={<FaUsers/>}
                    text="Total Employees"
                    number={
                        summary.totalEmployees
                    }
                    color="bg-green-600"/>
                <SummaryCard icon={<FaBuilding/>}
                    text="Total Departments"
                    number={
                        summary.totalDepartments
                    }
                    color="bg-sky-600"/>
                <SummaryCard icon={<FaMoneyBillWave/>}
                    text="Monthly Salary"
                    number={
                        `₹${
                            summary.totalSalary
                        }`
                    }
                    color="bg-purple-600"/>
            </div>

            {/* Leave Details */}
            <div className="mt-12">
                <h4 className="text-center text-lg sm:text-xl md:text-2xl font-bold">
                    Leave Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                    <SummaryCard icon={<FaFileAlt/>}
                        text="Leave Applied"
                        number={
                            summary.leaveSummary.appliedFor
                        }
                        color="bg-red-600"/>
                    <SummaryCard icon={<FaCheckCircle/>}
                        text="Leave Approved"
                        number={
                            summary.leaveSummary.approved
                        }
                        color="bg-green-600"/>
                    <SummaryCard icon={<FaHourglassHalf/>}
                        text="Leave Pending"
                        number={
                            summary.leaveSummary.pending
                        }
                        color="bg-yellow-600"/>
                    <SummaryCard icon={<FaTimesCircle/>}
                        text="Leave Rejected"
                        number={
                            summary.leaveSummary.rejected
                        }
                        color="bg-orange-600"/>
                </div>
            </div>
        </div>
    );
};

export default AdminSummary;
