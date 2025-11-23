import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setEmployee(response.data.employee);
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
    fetchEmployee();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  if (!employee) {
    return <div className="text-center mt-10 text-red-600">Employee not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
      >
        ← Back
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-8 text-center">Employee Details</h2>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row items-start md:space-x-10 space-y-6 md:space-y-0">
        {/* Left: Profile Image */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <img
            src={`http://localhost:5000/${employee?.userId?.profileImage}`}
            alt={employee?.userId?.name || "Employee"}
            className="rounded-full border w-48 md:w-64"
          />
        </div>

        {/* Right: Employee Info */}
        <div className="flex-1 space-y-5">
          <div className="flex space-x-3">
            <p className="text-lg font-bold">Name:</p>
            <p className="font-medium">{employee?.userId?.name}</p>
          </div>
          <div className="flex space-x-3">
            <p className="text-lg font-bold">Employee ID:</p>
            <p className="font-medium">{employee?.employeeId}</p>
          </div>
          <div className="flex space-x-3">
            <p className="text-lg font-bold">Date of Birth:</p>
            <p className="font-medium">
              {employee?.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div className="flex space-x-3">
            <p className="text-lg font-bold">Gender:</p>
            <p className="font-medium">{employee?.gender}</p>
          </div>
          <div className="flex space-x-3">
            <p className="text-lg font-bold">Department:</p>
            <p className="font-medium">{employee?.department?.dep_name}</p>
          </div>
          <div className="flex space-x-3">
            <p className="text-lg font-bold">Marital Status:</p>
            <p className="font-medium">{employee?.maritalStatus}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
