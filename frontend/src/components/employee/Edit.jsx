import {useEffect, useState} from "react";
import {fetchDepartments} from "../../utils/EmployeeHelper";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";

const Edit = () => {
    const [employee, setEmployee] = useState({
        name: "",
        employeeId: "",
        maritalStatus: "",
        designation: "",
        salary: "",
        department: ""
    });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        const getDepartments = async () => {
            const deps = await fetchDepartments();
            setDepartments(deps);
        };
        getDepartments();
    }, []);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(`https://employee-management-system-sbvn.onrender.com/api/employee/${id}`, {
                    headers: {
                        Authorization: ` Bearer ${
                            localStorage.getItem("token")
                        }`
                    }
                });
                if (response.data.success) {
                    const emp = response.data.employee;
                    setEmployee({
                        name: emp ?. userId ?. name || "",
                        employeeId: emp.employeeId || "",
                        maritalStatus: emp.maritalStatus || "",
                        designation: emp.designation || "",
                        salary: emp.salary || "",
                        department: emp.department || ""
                    });
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

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (name === "image") {
            setEmployee((prev) => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setEmployee((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        Object.keys(employee).forEach((key) => {
            formDataObj.append(key, employee[key]);
        });

        try {
            const response = await axios.put(`https://employee-management-system-sbvn.onrender.com/api/employee/${id}`, formDataObj, {
                headers: {
                    Authorization: `Bearer ${
                        localStorage.getItem("token")
                    }`
                }
            });
            if (response.data.success) {
                navigate("/admin-dashboard/employees");
            }
        } catch (error) {
            console.error(error.message);
            if (error.response && !error.response.data.success) {
                alert(error.response.data.message);
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-10">
            Loading ...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            {/* Back Button */}
            <button onClick={
                    () => navigate(-1)
                }
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
                ← Back
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Employee</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name"
                            value={
                                employee.name
                            }
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>

                    {/* Employee ID (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                        <input type="text" name="employeeId"
                            value={
                                employee.employeeId
                            }
                            readOnly
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"/>
                    </div>

                    {/* Marital Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                        <select name="maritalStatus"
                            value={
                                employee.maritalStatus
                            }
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                            <option value="">Select Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                        </select>
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <input type="text" name="designation"
                            value={
                                employee.designation
                            }
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salary</label>
                        <input type="number" name="salary"
                            value={
                                employee.salary
                            }
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select name="department"
                            value={
                                employee.department
                            }
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                            <option value="">Select Department</option>
                            {
                            departments.map((dep) => (
                                <option key={
                                        dep._id
                                    }
                                    value={
                                        dep._id
                                }>
                                    {
                                    dep.dep_name
                                } </option>
                            ))
                        } </select>
                    </div>
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <input type="file" name="image"
                            onChange={handleChange}
                            accept="image/*"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Update Employee
                </button>
            </form>
        </div>
    );
};

export default Edit;
