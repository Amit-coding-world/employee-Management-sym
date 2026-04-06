import {useEffect, useState} from "react";
import {fetchDepartments, getEmployees} from "../../utils/EmployeeHelper";
import api from "../../utils/api";
import {useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loading from "../Loading";

const addSalarySchema = z.object({
    department: z.string().min(1, "Department is required"),
    employeeId: z.string().min(1, "Employee is required"),
    basicSalary: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number({ required_error: "Basic Salary is required", invalid_type_error: "Basic Salary must be a valid number" }).nonnegative("Basic Salary must be non-negative")),
    allowances: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number({ required_error: "Allowances is required", invalid_type_error: "Allowances must be a valid number" }).nonnegative("Allowances must be non-negative")),
    deductions: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number({ required_error: "Deductions is required", invalid_type_error: "Deductions must be a valid number" }).nonnegative("Deductions must be non-negative")),
    payDate: z.string()
        .min(1, "Pay Date is required")
        .refine((date) => new Date(date) <= new Date(), { message: "Pay Date cannot be in the future" })
});

const AddSalary = () => {
    const [departments, setDepartments] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [submitError, setSubmitError] = useState("");

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(addSalarySchema)
    });

    useEffect(() => {
        const getDepartments = async () => {
            const departments = await fetchDepartments();
            setDepartments(departments);
        };
        getDepartments();
    }, []);

    const handleDepartment = async (e) => {
        setValue("department", e.target.value, { shouldValidate: true });
        if (e.target.value) {
            const emps = await getEmployees(e.target.value);
            setEmployees(emps);
        } else {
            setEmployees([]);
        }
    }

    const onSubmit = async (data) => {
        setSubmitError("");
        try {
            const response = await api.post(`/salary/add`, data);
            if (response.data.success) {
                navigate("/admin-dashboard/employees");
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                setSubmitError(error.response.data.message || error.response.data.error || "An error occurred");
            } else {
                setSubmitError("Failed to connect to the server.");
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

            {submitError && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-r-md shadow-sm flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {submitError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Department
                        </label>
                        <select
                            {...register("department")}
                            onChange={handleDepartment}
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.department ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
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
                        {errors.department && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.department.message}</p>}
                    </div>

                    {/* employee */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Employee
                        </label>
                        <select
                            {...register("employeeId")}
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.employeeId ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
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
                        {errors.employeeId && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.employeeId.message}</p>}
                    </div>

                    {/* Basic Salary  */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Basic Salary
                        </label>
                        <input type="number"
                            min="0"
                            {...register("basicSalary")}
                            placeholder="Basic Salary"
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.basicSalary ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.basicSalary && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.basicSalary.message}</p>}
                    </div>

                    {/* Allowances */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Allowances
                        </label>
                        <input type="number" 
                            min="0"
                            {...register("allowances")}
                            placeholder="Allowances"
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.allowances ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.allowances && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.allowances.message}</p>}
                    </div>

                    {/* Deductions  */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Deductions
                        </label>
                        <input type="number" 
                            min="0"
                            {...register("deductions")}
                            placeholder="Deductions"
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.deductions ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.deductions && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.deductions.message}</p>}
                    </div>

                    {/* Pay Date  */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Pay Date
                        </label>
                        <input type="date"
                            max={new Date().toISOString().split("T")[0]}
                            {...register("payDate")}
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.payDate ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.payDate && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.payDate.message}</p>}
                    </div>
                </div>

                {/* Submit */}
                <button type="submit" 
                    disabled={isSubmitting}
                    className={`w-full mt-6 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}>
                    {isSubmitting ? "Adding Salary..." : "Add Salary"}
                </button>
            </form>
        </div>
    );
};

export default AddSalary;
