import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/department/add",
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      console.error(error.message);
      if (error.response && !error.response.data.success) {
        alert(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ⬅ Back
      </button>

      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md sm:flex-1">
        <h2 className="text-2xl font-bold mb-6">Add New Department</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="dep_name"
              className="text-sm font-medium text-gray-700"
            >
              Department Name
            </label>
            <input
              type="text"
              name="dep_name"
              onChange={handleChange}
              value={department.dep_name}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Department Name"
            />
          </div>
          <div className="mt-3">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              value={department.description}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Department Description"
              rows="4"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
            }`}
          >
            {loading ? "Adding..." : "Add Department"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
