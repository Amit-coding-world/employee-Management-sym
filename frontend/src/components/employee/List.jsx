import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { columns, EmployeeButtons } from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";

const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployee, setFilteredEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get("https://employee-management-system-sbvn.onrender.com/api/employee", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            _id: emp._id,
            sno: sno++,
            dep_name: emp?.department?.dep_name || "N/A",
            name: emp?.userId?.name || "N/A",
            dob: emp?.dob ? new Date(emp.dob).toLocaleDateString() : "N/A",
            profileImage: (
              <img
                width={40}
                className="rounded-full"
                src={emp?.userId?.profileImage}
                alt={emp?.userId?.name || "Employee"}
              />
            ),
            action: <EmployeeButtons _id={emp._id} />,
          }));
          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        console.error(error.message);
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setEmpLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleFilter = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const records = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchValue)
    );
    setFilteredEmployees(records);
  };

  return (
    <div className="p-6">
      <div className="text-center p-6">
        <h3 className="text-2xl font-bold">Manage Employee</h3>
      </div>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search By Emp. Name"
          className="px-4 py-1 border border-gray-300 rounded"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-500"
        >
          Add New Employee
        </Link>
      </div>

      <div className="mt-6">
        {empLoading ? (
          <div className="text-center text-gray-500">Loading employees...</div>
        ) : filteredEmployee.length > 0 ? (
          <DataTable columns={columns} data={filteredEmployee} pagination />
        ) : (
          <div className="text-center text-gray-500">No employees found</div>
        )}
      </div>
    </div>
  );
};

export default List;
