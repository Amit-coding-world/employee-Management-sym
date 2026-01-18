import {FaUser, FaCheckCircle, FaTimesCircle, FaHourglassHalf} from "react-icons/fa";
import {useAuth} from "../../context/authContext";
import {useEffect, useState} from "react";
import axios from "axios";

const Summary = () => {
    const {user} = useAuth();
    const [attendance, setAttendance] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get("https://employee-management-system-sbvn.onrender.com/api/attendance/user-status", {
                    headers: {
                        Authorization: `Bearer ${
                            localStorage.getItem("token")
                        }`
                    }
                });
                if (response.data.success) {
                    setAttendance(response.data.attendance);
                }
            } catch (error) {
                console.error("Error fetching today's attendance:", error.message);
            }
        };
        fetchAttendance();
    }, []);

    const getStatusDisplay = () => {
        if (!attendance) 
            return {
                text: "Not Marked",
                color: "text-gray-500",
                icon: <FaHourglassHalf/>};
        


        switch (attendance.status ?. toLowerCase()) {
            case 'present':
                return {
                    text: "Present",
                    color: "text-green-600",
                    icon: <FaCheckCircle/>};
            case 'absent':
                return {
                    text: "Absent",
                    color: "text-red-600",
                    icon: <FaTimesCircle/>};
            case 'sick':
                return {
                    text: "Sick",
                    color: "text-yellow-600",
                    icon: <FaHourglassHalf/>};
            case 'leave':
                return {
                    text: "Leave",
                    color: "text-blue-600",
                    icon: <FaHourglassHalf/>};
            default:
                return {
                    text: attendance.status || "Not Marked",
                    color: "text-gray-500",
                    icon: <FaHourglassHalf/>};
        }
    };

    const status = getStatusDisplay();

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center bg-white rounded-md shadow-md overflow-hidden">
                    {/* Icon */}
                    <div className="flex justify-center items-center bg-teal-600 text-white px-6 py-4 text-3xl">
                        <FaUser/>
                    </div>

                    {/* Text */}
                    <div className="pl-4 py-2">
                        <p className="text-lg font-semibold text-gray-600">Welcome Back</p>
                        <p className="text-xl font-bold text-gray-800">
                            {
                            user ?. name
                        }</p>
                        {
                        user ?. role && (
                            <p className="text-sm text-gray-500 mt-1">Role: {
                                user.role
                            }</p>
                        )
                    } </div>
                </div>

                {/* Attendance Status Card */}
                <div className="flex items-center bg-white rounded-md shadow-md overflow-hidden">
                    <div className={
                        `flex justify-center items-center ${
                            status.color.replace('text', 'bg')
                        } text-white px-6 py-4 text-3xl`
                    }>
                        {
                        status.icon
                    } </div>
                    <div className="pl-4 py-2">
                        <p className="text-lg font-semibold text-gray-600">Today's Attendance</p>
                        <p className={
                            `text-xl font-bold ${
                                status.color
                            }`
                        }>
                            {
                            status.text
                        }</p>
                        <p className="text-sm text-gray-500 mt-1">
                            {
                            new Date().toDateString()
                        }</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Summary;
