import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const List = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/leave/${id}/${user.role}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setLeaves(response.data.leaves);
        setFilteredLeaves(response.data.leaves);
      }
    } catch (error) {
      console.error(error.message);
      if (error.response && !error.response.data.success) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const records = leaves.filter((leave) =>
      leave?.employeeId?.userId?.name?.toLowerCase().includes(searchValue)
    );
    setFilteredLeaves(records);
  };

  const renderStatusBadge = (status) => {
    let colorClass = "";
    switch (status) {
      case "Approved":
        colorClass = "bg-green-100 text-green-700";
        break;
      case "Rejected":
        colorClass = "bg-red-100 text-red-700";
        break;
      default:
        colorClass = "bg-yellow-100 text-yellow-700";
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}>
        {status}
      </span>
    );
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
          placeholder="Search By Emp. Name"
          className="px-4 py-1 border border-gray-300 rounded"
          onChange={handleSearch}
        />
        {user.role === "employee" && (
          <Link
            to="/employee-dashboard/add-leave"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-500"
          >
            Add New Leave
          </Link>
        )}
      </div>

      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
          <tr>
            <th className="px-6 py-3">SNO</th>
            <th className="px-6 py-3">Employee</th>
            <th className="px-6 py-3">Leave Type</th>
            <th className="px-6 py-3">From</th>
            <th className="px-6 py-3">To</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.map((leave, index) => (
            <tr key={leave._id} className="bg-white border-b hover:bg-gray-100">
              <td className="px-6 py-3 font-bold">{index + 1}</td>
              <td className="px-6 py-3 font-bold">
                {leave?.employeeId?.userId?.name || "N/A"}
              </td>
              <td className="px-6 py-3 font-bold">{leave.leaveType}</td>
              <td className="px-6 py-3 font-bold">
                {leave?.startDate
                  ? new Date(leave.startDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-3 font-bold">
                {leave?.endDate
                  ? new Date(leave.endDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-3 font-bold">{leave.reason}</td>
              <td className="px-6 py-3 font-bold">
                {renderStatusBadge(leave.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default List;
