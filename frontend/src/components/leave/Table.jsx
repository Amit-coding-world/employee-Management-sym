import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LeaveButtons, columns } from "../../utils/LeaveHelper";
import axios from "axios";
import DataTable from "react-data-table-component";

const Table = () => {
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://employee-management-system-sbvn.onrender.com/api/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; // inclusive difference

          return {
            _id: leave._id,
            sno: sno++,
            employeeId: leave?.employeeId?.employeeId || "N/A",
            name: leave?.employeeId?.userId?.name || "N/A",
            leaveType: leave.leaveType,
            department: leave?.employeeId?.department?.dep_name || "N/A",
            days,
            status: leave.status,
            action: <LeaveButtons _id={leave._id} />,
          };
        });
        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      console.error(error.message);
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filterByInput = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const data = leaves.filter(
      (leave) =>
        leave.employeeId.toLowerCase().includes(searchValue) ||
        leave.name.toLowerCase().includes(searchValue)
    );
    setFilteredLeaves(data);
  };

  const filterByButton = (status) => {
    const data = leaves.filter((leave) =>
      leave.status.toLowerCase().includes(status.toLowerCase())
    );
    setFilteredLeaves(data);
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>

      <div className="text-center p-6">
        <h3 className="text-2xl font-bold">Manage Leaves</h3>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search By Emp ID or Name"
          onChange={filterByInput}
          className="px-4 py-1 border border-gray-300 rounded"
        />
        <div className="space-x-3 flex">
          <button
            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => filterByButton("Pending")}
          >
            Pending
          </button>
          <button
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => filterByButton("Approved")}
          >
            Approved
          </button>
          <button
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => filterByButton("Rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="mt-3">
        <DataTable columns={columns} data={filteredLeaves} pagination />
      </div>
    </div>
  );
};

export default Table;
