import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditDepartment = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState({ dep_name: "", description: "" });
  const [depLoading, setDepLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/department/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.success) {
          setDepartment(response.data.department);
        }
      } catch (error) {
        console.error(error.message);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setDepLoading(false);
      }
    };
    fetchDepartment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/department/${id}`,
        department,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
      setSubmitting(false);
    }
  };

  if (depLoading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Edit Department</h2>

      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
      >
        ← Back
      </button>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="dep_name" className="text-sm font-medium text-gray-700">
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
          disabled={submitting}
          className={`mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded ${
            submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
          }`}
        >
          {submitting ? "Updating..." : "Edit Department"}
        </button>
      </form>
    </div>
  );
};

export default EditDepartment;
