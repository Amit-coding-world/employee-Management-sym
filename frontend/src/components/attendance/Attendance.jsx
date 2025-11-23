import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { columns, AttendanceHelper } from "../../utils/AttendanceHelper";
import DataTable from "react-data-table-component";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  const statusChange = () => {
    fetchAttendance();
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://employee-management-system-sbvn.onrender.com/api/attendance", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.attendance.map((att) => ({
          sno: sno++,
          employeeId: att.employeeId.employeeId,
          department: att.employeeId.department.dep_name,
          name: att.employeeId.userId.name,
          action: (
            <AttendanceHelper
              status={att.status}
              employeeId={att.employeeId.employeeId}
              statusChange={statusChange}
            />
          ),
        }));
        setAttendance(data);
        setFilteredAttendance(data);
      }
    } catch (error) {
      const message = error.response?.data?.error || error.message;
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleFilter = (e) => {
    const records = attendance.filter((emp) =>
      emp.employeeId.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredAttendance(records);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center p-6">
        <h3 className="text-2xl font-bold">Manage Attendance</h3>
      </div>
      <div className="flex justify-between items-center mt-4">
        <input
          type="text"
          placeholder="Search By Emp ID"
          className="px-4 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleFilter}
        />
        <p className="text-2xl">
          Mark Employees for{" "}
          <span className="font-bold underline">
            {new Date().toISOString().split("T")[0]}
          </span>
        </p>
        <Link
          to="/admin-dashboard/attendance-report"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-500 transition"
        >
          Attendance Report
        </Link>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={filteredAttendance} pagination />
      </div>
    </div>
  );
};

export default Attendance;
