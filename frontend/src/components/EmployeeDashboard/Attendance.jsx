import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const {id} = useParams(); // This is the userId

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try { // First get the employee record to get the employee document _id
                const empResponse = await axios.get(`https://employee-management-system-sbvn.onrender.com/api/employee/${id}`, {
                    headers: {
                        Authorization: `Bearer ${
                            localStorage.getItem("token")
                        }`
                    }
                });

                if (empResponse.data.success) {
                    const employeeId = empResponse.data.employee._id;

                    // Now fetch attendance report filtered by this employeeId
                    const response = await axios.get(`https://employee-management-system-sbvn.onrender.com/api/attendance/report?employeeId=${employeeId}&limit=100`, {
                        headers: {
                            Authorization: `Bearer ${
                                localStorage.getItem("token")
                            }`
                        }
                    });

                    if (response.data.success) {
                        setAttendance(response.data.groupData);
                    }
                }
                setLoading(false);
            } catch (error) {
                alert(error.message);
                setLoading(false);
            }
        };
        fetchAttendance();
    }, [id]);

    return (
        <div className="p-6">
            <div className="text-center p-6">
                <h3 className="text-2xl font-bold">My Attendance History</h3>
            </div>

            {
            loading ? (
                <p className="text-center">Loading...</p>
            ) : Object.keys(attendance).length === 0 ? (
                <p className="text-center">No attendance records found.</p>
            ) : (
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 border">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3">S No</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody> {
                            Object.entries(attendance).map(([
                                date, records
                            ], index) => (
                                <tr key={date}
                                    className="bg-white border-b hover:bg-gray-100">
                                    <td className="px-6 py-3">
                                        {
                                        index + 1
                                    }</td>
                                    <td className="px-6 py-3">
                                        {date}</td>
                                    <td className="px-6 py-3 font-semibold">
                                        <span className={
                                            `px-2 py-1 rounded-md text-white ${
                                                records[0].status ?. toLowerCase() === 'present' ? 'bg-green-500' : records[0].status ?. toLowerCase() === 'absent' ? 'bg-red-500' : records[0].status ?. toLowerCase() === 'sick' ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`
                                        }>
                                            {
                                            records[0].status
                                        } </span>
                                    </td>
                                </tr>
                            ))
                        } </tbody>
                    </table>
                </div>
            )
        } </div>
    );
};

export default Attendance;
