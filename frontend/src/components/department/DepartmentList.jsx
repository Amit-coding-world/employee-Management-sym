import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { columns, DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";
import { useState, useEffect } from "react";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const onDepartmentDelete = async () => {
    fetchDepartments();
  };

  const fetchDepartments = async () => {
    setDepLoading(true);
    try {
      const response = await axios.get("https://employee-management-system-sbvn.onrender.com/api/department", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        let sno = 1;
        const data = response.data.departments.map((dep) => ({
          _id: dep._id,
          sno: sno++,
          dep_name: dep?.dep_name || "N/A",
          action: (
            <DepartmentButtons
              _id={dep._id}
              onDepartmentDelete={onDepartmentDelete}
            />
          ),
        }));
        setDepartments(data);
        setFilteredDepartments(data);
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

  useEffect(() => {
    fetchDepartments();
  }, []);

  const filterDepartments = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const records = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(searchValue)
    );
    setFilteredDepartments(records);
  };

  return (
    <div className="p-5">
      <div className="text-center p-6">
        <h3 className="text-2xl font-bold">Manage Departments</h3>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Department Name"
          className="px-4 py-1 border border-gray-300 rounded"
          onChange={filterDepartments}
        />
        <Link
          to="/admin-dashboard/add-department"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-500"
        >
          Add New Department
        </Link>
      </div>

      <div className="mt-5">
        {depLoading ? (
          <div className="text-center text-gray-500">Loading departments...</div>
        ) : filteredDepartments.length > 0 ? (
          <DataTable columns={columns} data={filteredDepartments} pagination />
        ) : (
          <div className="text-center text-gray-500">No departments found</div>
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
