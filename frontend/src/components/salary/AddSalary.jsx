import {useEffect, useState} from "react";
import {fetchDepartments, getEmployees} from "../../utils/EmployeeHelper";
import api from "../../utils/api";
import {useNavigate} from "react-router-dom";
import Loading from "../Loading";

const AddSalary = () => {
    const [salary, setSalary] = useState({
        employeeId: null,
        basicSalary: 0,
        allowances: 0,
        deductions: 0,
        payDate: null
    });
    const [departments, setDepartments] = useState(null);
    const [employees, setEmployees] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            setDepartments(departments);
        };
        getDepartments();
    }, []);

    const handleDepartment = async (e) => {
        const emps = await getEmployees(e.target.value)
        setEmployees(emps)
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSalary((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/salary/add`, salary);
            if (response.data.success) {
                navigate("/admin-dashboard/employees");
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.message);
            }
        }
    };

    if (!departments) {
        return <Loading/>;
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
            <h2 className="text-2xl font-bold mb-6 text-center">Add Salary</h2>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ... rest of your form ... */}
                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Department
                        </label>
                        <select name="department"
                            onChange={handleDepartment}
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
                    {/* employee */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Employee
                        </label>
                        <select name="employeeId"
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                            <option value="">Select Employee</option>
                            {
                            employees.map((emp) => (
                                <option key={
                                        emp._id
                                    }
                                    value={
                                        emp._id
                                }>
                                    {
                                    emp.userId ?. name || emp.employeeId
                                } </option>
                            ))
                        } </select>
                    </div>

                    {/* Basic Salary  */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Basic Salary
                        </label>
                        <input type="number" name="basicSalary"
                            onChange={handleChange}
                            placeholder="Basic Salary"
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                    {/* Allowances */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Allowances
                        </label>
                        <input type="number" name="allowances" placeholder="allowances"
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>

                    {/* Deductions  */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Deductions
                        </label>
                        <input type="number" name="deductions" placeholder="deductions"
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>

                    {/* Pay Date  */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Pay Date
                        </label>
                        <input type="date" name="payDate"
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" className="w-full mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                    Add Salary
                </button>
            </form>
        </div>
    );
};

export default AddSalary;
