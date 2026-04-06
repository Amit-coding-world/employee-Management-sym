import {useEffect, useState} from "react";
import {fetchDepartments} from "../../utils/EmployeeHelper";
import api from "../../utils/api";
import {useNavigate} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loading from "../Loading";

const addManagerSchema = z.object({
    name: z.string().min(1, "Name is required").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    employeeId: z.string().min(1, "Employee ID is required").regex(/^[a-zA-Z0-9]+$/, "Employee ID must be alphanumeric"),
    dob: z.coerce.date({ required_error: "Date of Birth is required", invalid_type_error: "Invalid Date" })
        .refine((date) => {
            const ageDifMs = Date.now() - date.getTime();
            const ageDate = new Date(ageDifMs);
            return Math.abs(ageDate.getUTCFullYear() - 1970) >= 18;
        }, { message: "Manager must be at least 18 years old" }),
    gender: z.enum(["male", "female", "other"], { required_error: "Gender is required" }),
    maritalStatus: z.enum(["single", "married"], { required_error: "Marital status is required" }),
    department: z.string().min(1, "Department is required"),
    designation: z.string().min(1, "Designation is required").regex(/^[a-zA-Z\s]+$/, "Designation must contain only letters"),
    salary: z.coerce.number({ required_error: "Salary is required", invalid_type_error: "Salary must be a number" }).positive("Salary must be a positive number"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const Add = () => {
    const [departments, setDepartments] = useState([]);
    const [submitError, setSubmitError] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(addManagerSchema)
    });

    useEffect(() => {
        const getDepartments = async () => {
            try {
                const deps = await fetchDepartments();
                setDepartments(deps || []);
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
        
        // Ensure role is manager
        formDataObj.append("role", "manager");

        const fileInput = e.target.image;
        if (fileInput && fileInput.files && fileInput.files[0]) {
            formDataObj.append("image", fileInput.files[0]);
        }

        try {
            const response = await api.post('/employee/add', formDataObj);
            if (response.data.success) {
                navigate("/admin-dashboard/managers");
            }
        } catch (error) {
            if (error.response && error.response.data && !error.response.data.success) {
                setSubmitError(error.response.data.error || error.response.data.message || "An error occurred");
            } else {
                setSubmitError("Failed to connect to the server.");
            }
        }
    };

    if (departments.length === 0) {
        return <Loading/>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            <button onClick={
                    () => navigate(-1)
                }
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
                ← Back
            </button>
            <h2 className="text-2xl font-bold mb-6 text-teal-600">Add New Manager</h2>
            
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text"
                            {...register("name")}
                            placeholder="Insert Name"
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email"
                            {...register("email")}
                            placeholder="Insert Email"
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                        <input type="text"
                            {...register("employeeId")}
                            placeholder="Employee ID"
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.employeeId ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.employeeId && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.employeeId.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input type="date"
                            {...register("dob")}
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.dob ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.dob && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.dob.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select
                            {...register("gender")}
                            className={`mt-1 p-2 block w-full border rounded-md bg-white ${errors.gender ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.gender.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                        <select
                            {...register("maritalStatus")}
                            className={`mt-1 p-2 block w-full border rounded-md bg-white ${errors.maritalStatus ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                            <option value="">Select Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                        </select>
                        {errors.maritalStatus && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.maritalStatus.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select
                            {...register("department")}
                            className={`mt-1 p-2 block w-full border rounded-md bg-white ${errors.department ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
                            <option value="">Select Department</option>
                            {departments.map((dep) => (
                                <option key={dep._id} value={dep._id}>
                                    {dep.dep_name}
                                </option>
                            ))}
                        </select>
                        {errors.department && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.department.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <input type="text"
                            {...register("designation")}
                            placeholder="Designation"
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.designation ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.designation && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.designation.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salary</label>
                        <input type="number"
                            min="0"
                            {...register("salary")}
                            placeholder="Salary"
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.salary ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.salary && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.salary.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password"
                            {...register("password")}
                            placeholder="******"
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <input type="file" name="image"
                            accept="image/*"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                </div>
                
                <button type="submit"
                    disabled={isSubmitting}
                    className={`w-full mt-6 text-white font-bold py-2 px-4 rounded-md transition-colors ${isSubmitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}>
                    {isSubmitting ? "Adding..." : "Add Manager"}
                </button>
            </form>
        </div>
    );
};

export default Add;
