import {useEffect, useState} from "react";
import {fetchDepartments} from "../../utils/EmployeeHelper";
import api from "../../utils/api";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/authContext.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const addEmployeeSchema = z.object({
    name: z.string().min(1, "Name is required").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    employeeId: z.string().min(1, "Employee ID is required").regex(/^[a-zA-Z0-9]+$/, "Employee ID must be alphanumeric"),
    dob: z.coerce.date({ required_error: "Date of Birth is required", invalid_type_error: "Invalid Date" })
        .refine((date) => {
            const ageDifMs = Date.now() - date.getTime();
            const ageDate = new Date(ageDifMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
        }, { message: "Employee must be at least 18 years old" }),
    gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
    maritalStatus: z.enum(["single", "married"], { required_error: "Marital status is required" }),
    designation: z.string().min(1, "Designation is required").regex(/^[a-zA-Z\s]+$/, "Designation must contain only letters"),
    department: z.string().min(1, "Department is required"),
    salary: z.coerce.number({ required_error: "Salary is required", invalid_type_error: "Salary must be a number" }).positive("Salary must be a positive number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "manager", "employee"], { required_error: "Role is required" }),
});

const Add = () => {
    const [departments, setDepartments] = useState([]);
    const [submitError, setSubmitError] = useState("");
    const navigate = useNavigate();
    const {user} = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(addEmployeeSchema)
    });

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const departmentsData = await fetchDepartments();
                if (Array.isArray(departmentsData)) {
                    setDepartments(departmentsData);
                }
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        getDepartments();
    }, []);

    const onSubmit = async (data, e) => {
        setSubmitError("");
        const formDataObj = new FormData();
        
        Object.keys(data).forEach((key) => {
            if (key === 'dob') {
                formDataObj.append(key, e.target.dob.value); // Use raw input value for consistent formatting
            } else {
                formDataObj.append(key, data[key]);
            }
        });
        
        // Handle file upload manually since it's not part of standard Zod validation for this schema
        const fileInput = e.target.image;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            formDataObj.append("image", fileInput.files[0]);
        }

        try {
            const response = await api.post('/employee/add', formDataObj);
            if (response.data.success) {
                if (data.role === 'manager') {
                    navigate("/admin-dashboard/managers");
                } else {
                    navigate("/admin-dashboard/employees");
                }
            }
        } catch (error) {
            if (error.response && error.response.data && !error.response.data.success) {
                setSubmitError(error.response.data.error || error.response.data.message || "An error occurred");
            } else {
                setSubmitError("Failed to connect to the server.");
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            {/* Back Button */}
            <button onClick={() => navigate(-1)}
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
                ← Back
            </button>
            <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Add New Employee</h2>
                
                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-r-md shadow-sm flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {submitError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" 
                                {...register("name")}
                                placeholder="Insert Name"
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                            {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" 
                                {...register("email")}
                                placeholder="Insert Email"
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                        </div>
                        {/* Employee ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                            <input type="text"
                                {...register("employeeId")}
                                placeholder="Employee ID"
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.employeeId ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                            {errors.employeeId && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.employeeId.message}</p>}
                        </div>
                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input type="date" 
                                {...register("dob")}
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.dob ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                            {errors.dob && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.dob.message}</p>}
                        </div>
                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select 
                                {...register("gender")}
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.gender.message}</p>}
                        </div>
                        {/* Marital Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                            <select 
                                {...register("maritalStatus")}
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${errors.maritalStatus ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                                <option value="">Select Status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                            </select>
                            {errors.maritalStatus && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.maritalStatus.message}</p>}
                        </div>
                        {/* Designation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                            <input type="text"
                                {...register("designation")}
                                placeholder="Designation"
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.designation ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                            {errors.designation && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.designation.message}</p>}
                        </div>
                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select 
                                {...register("department")}
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${errors.department ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                                <option value="">Select Department</option>
                                {departments && departments.length > 0 && departments.map((dep) => (
                                    <option key={dep._id} value={dep._id}>
                                        {dep.dep_name}
                                    </option>
                                ))}
                            </select>
                            {errors.department && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.department.message}</p>}
                        </div>
                        {/* Salary */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                            <input type="number" 
                                min="0"
                                {...register("salary")}
                                placeholder="Salary"
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.salary ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                            {errors.salary && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.salary.message}</p>}
                        </div>
                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" 
                                {...register("password")}
                                placeholder="******"
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
                        </div>
                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select 
                                {...register("role")}
                                className={`w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${errors.role ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                                <option value="">Select Role</option>
                                {user?.role === 'admin' && (
                                    <>
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                    </>
                                )}
                                <option value="employee">Employee</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.role.message}</p>}
                        </div>
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                            <input type="file" name="image"
                                accept="image/*"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors file:bg-gray-100 file:border-0 file:rounded-md file:py-1 file:px-3 file:mr-3 file:text-sm file:font-medium"/>
                        </div>
                    </div>
                    <button type="submit" 
                        disabled={isSubmitting}
                        className={`w-full mt-8 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'}`}>
                        {isSubmitting ? 'Adding Employee...' : 'Add Employee'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Add;
