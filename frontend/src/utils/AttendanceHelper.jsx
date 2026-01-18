import {useState} from "react";
import axios from "axios";

export const columns = [
    {
        name: "S No.",
        selector: (row) => row.sno,
        width: "70px"
    },
    {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        width: "100px"
    },
    {
        name: "Emp ID",
        selector: (row) => row.employeeId,
        sortable: true,
        width: "100px"
    },
    {
        name: "Department",
        selector: (row) => row.department,
        sortable: true,
        width: "120px"
    }, {
        name: "Action",
        cell: (row) => row.action,
        center: true
    },
];

export const AttendanceHelper = ({status, employeeId, statusChange}) => {
    const [updating, setUpdating] = useState(false);

    const markEmployee = async (status, employeeId) => {
        setUpdating(true);
        try {
            const response = await axios.put(`https://employee-management-system-sbvn.onrender.com/api/attendance/update/${employeeId}`, {
                status
            }, {
                headers: {
                    Authorization: `Bearer ${
                        localStorage.getItem("token")
                    }`
                }
            });
            if (response.data.success) {
                statusChange();
            }
        } catch (error) {
            console.error("Error updating attendance:", error);
            alert(error.response ?. data ?. message || "Failed to update attendance");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div> {
            status === null ? (
                <div className="flex space-x-2">
                    <button className={
                            `px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ${
                                updating ? "opacity-50 cursor-not-allowed" : ""
                            }`
                        }
                        onClick={
                            () => markEmployee("present", employeeId)
                        }
                        disabled={updating}>
                        Present
                    </button>
                    <button className={
                            `px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                                updating ? "opacity-50 cursor-not-allowed" : ""
                            }`
                        }
                        onClick={
                            () => markEmployee("absent", employeeId)
                        }
                        disabled={updating}>
                        Absent
                    </button>
                    <button className={
                            `px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                                updating ? "opacity-50 cursor-not-allowed" : ""
                            }`
                        }
                        onClick={
                            () => markEmployee("sick", employeeId)
                        }
                        disabled={updating}>
                        Sick
                    </button>
                    <button className={
                            `px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                                updating ? "opacity-50 cursor-not-allowed" : ""
                            }`
                        }
                        onClick={
                            () => markEmployee("leave", employeeId)
                        }
                        disabled={updating}>
                        Leave
                    </button>
                </div>
            ) : (
                <p className="bg-gray-100 w-20 text-center py-2 rounded">
                    {status}</p>
            )
        } </div>
    );
};
