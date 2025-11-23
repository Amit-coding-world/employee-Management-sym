import axios from "axios";

export const columns = [
  { name: "S No.", selector: (row) => row.sno, width: "70px" },
  { name: "Name", selector: (row) => row.name, sortable: true, width: "100px" },
  { name: "Emp ID", selector: (row) => row.employeeId, sortable: true, width: "100px" },
  { name: "Department", selector: (row) => row.department, sortable: true, width: "120px" },
  { name: "Action", cell: (row) => row.action, center: true },
];

export const AttendanceHelper = ({ status, employeeId, statusChange }) => {
  const markEmployee = async (status, employeeId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/attendance/update/${employeeId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      if (response.data.success) {
        statusChange();
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      alert(error.response?.data?.message || "Failed to update attendance");
    }
  };

  return (
    <div>
      {status === null ? (
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={() => markEmployee("present", employeeId)}
          >
            Present
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => markEmployee("absent", employeeId)}
          >
            Absent
          </button>
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => markEmployee("sick", employeeId)}
          >
            Sick
          </button>
          <button
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            onClick={() => markEmployee("leave", employeeId)}
          >
            Leave
          </button>
        </div>
      ) : (
        <p className="bg-gray-100 w-20 text-center py-2 rounded">{status}</p>
      )}
    </div>
  );
};
