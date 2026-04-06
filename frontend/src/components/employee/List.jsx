import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import api, {BASE_URL} from "../../utils/api";
import {columns, EmployeeButtons} from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";
import Loading from "../Loading";


const List = () => {
    const [employees, setEmployees] = useState([]);
    const [empLoading, setEmpLoading] = useState(false);
    const [filteredEmployee, setFilteredEmployees] = useState([]);

    const onEmployeeDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee?")) {
            try {
                const response = await api.delete(`/employee/${id}`);
                if (response.data.success) {
                    fetchEmployees();
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error || "Failed to delete employee");
                }
            }
        }
    };

    const fetchEmployees = async () => {
        setEmpLoading(true);
        try {
            const response = await api.get('/employee');
            if (response.data.success) {
                let sno = 1;
                const data = response.data.employees.filter(emp => emp.userId.role === 'employee').map((emp) => ({
                    _id: emp._id,
                    sno: sno++,
                    dep_name: emp ?. department ?. dep_name || "N/A",
                    name: emp ?. userId ?. name || "N/A",
                    dob: emp ?. dob ? new Date(emp.dob).toLocaleDateString() : "N/A",
                    profileImage: (
                        <img width={40}
                            className="rounded-full"
                            src={
                                emp ?. userId ?. profileImage ? (emp.userId.profileImage.startsWith("http") ? emp.userId.profileImage : `${BASE_URL}/${
                                    emp.userId.profileImage
                                }`) : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                            }
                            alt={
                                emp ?. userId ?. name || "Employee"
                            }/>
                    ),
                    action: <EmployeeButtons _id={emp._id} onEmployeeDelete={onEmployeeDelete} />
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

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleFilter = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const records = employees.filter((emp) => emp.name.toLowerCase().includes(searchValue));
        setFilteredEmployees(records);
    };

    return (
        <div className="p-6">
            <div className="text-center p-6">
                <h3 className="text-2xl font-bold">Manage Employee</h3>
            </div>

            <div className="flex justify-between items-center">
                <input type="text" placeholder="Search By Emp. Name" className="px-4 py-1 border border-gray-300 rounded"
                    onChange={handleFilter}/>
                <Link to="/admin-dashboard/add-employee" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-500">
                    Add New Employee
                </Link>
            </div>

            <div className="mt-6">
                {
                empLoading ? (
                    <Loading/>) : filteredEmployee.length > 0 ? (
                    <DataTable columns={columns}
                        data={filteredEmployee}
                        pagination/>
                ) : (
                    <div className="text-center text-gray-500">No employees found</div>
                )
            } </div>
        </div>
    );
};

export default List;
