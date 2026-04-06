import {useEffect, useState} from "react";
import {fetchDepartments} from "../../utils/EmployeeHelper";
import api, {BASE_URL} from "../../utils/api";
import {useNavigate, useParams} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loading from "../Loading";

const editManagerSchema = z.object({
    name: z.string().min(1, "Name is required").regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),
    maritalStatus: z.enum(["single", "married"], { required_error: "Marital status is required" }),
    designation: z.string().min(1, "Designation is required").regex(/^[a-zA-Z\s]+$/, "Designation must contain only letters"),
    department: z.string().min(1, "Department is required"),
    salary: z.coerce.number({ required_error: "Salary is required", invalid_type_error: "Salary must be a number" }).positive("Salary must be a positive number"),
});

const Edit = () => {
    const [employee, setEmployee] = useState({
        profileImage: "",
        image: null
    });
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState("");
    const navigate = useNavigate();
    const {id} = useParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(editManagerSchema)
    });

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
                const response = await api.get(`/employee/${id}`);
                if (response.data.success) {
                    const emp = response.data.employee;
                    setEmployee({
                        profileImage: emp ?. userId ?. profileImage || "",
                        image: null
                    });
                    
                    reset({
                        name: emp ?. userId ?. name || "",
                        maritalStatus: emp.maritalStatus || "",
                        designation: emp.designation || "",
                        salary: emp.salary || "",
                        department: emp.department ?. _id || emp.department || "",
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
    }, [id, reset]);

    const handleImageChange = (e) => {
        const {files} = e.target;
        if (files && files[0]) {
            setEmployee((prev) => ({
                ...prev,
                image: files[0]
            }));
        }
    };

    const getImageSource = () => {
        if (employee.image && employee.image instanceof File) {
            return URL.createObjectURL(employee.image);
        }
        if (employee.profileImage) {
            return employee.profileImage.startsWith("http") ? employee.profileImage : `${BASE_URL}/${
                employee.profileImage
            }`;
        }
        return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    };

    const onSubmit = async (data) => {
        setSubmitError("");
        const formDataObj = new FormData();
        Object.keys(data).forEach((key) => {
            formDataObj.append(key, data[key]);
        });
        
        if (employee.image) {
            formDataObj.append("image", employee.image);
        }

        try {
            const response = await api.put(`/employee/${id}`, formDataObj);
            if (response.data.success) {
                navigate("/admin-dashboard/managers");
            }
        } catch (error) {
            console.error(error.message);
            if (error.response && !error.response.data.success) {
                setSubmitError(error.response.data.error || error.response.data.message || "Update failed");
            } else {
                setSubmitError("Failed to connect to the server.");
            }
        }
    };

    if (loading) {
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

            <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">Edit Manager</h2>

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
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name.message}</p>}
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
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <input type="text"
                            {...register("designation")}
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.designation ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.designation && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.designation.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salary</label>
                        <input type="number"
                            min="0"
                            {...register("salary")}
                            className={`mt-1 p-2 block w-full border rounded-md ${errors.salary ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}/>
                        {errors.salary && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.salary.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select
                            {...register("department")}
                            className={`mt-1 p-2 block w-full border rounded-md bg-white ${errors.department ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
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
                                }</option>
                            ))
                        } </select>
                        {errors.department && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.department.message}</p>}
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 border rounded-md bg-gray-50">
                        <img src={
                                getImageSource()
                            }
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-2 border-teal-500 mb-2"/>
                        <p className="text-xs text-gray-500">Image Preview</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload New Image</label>
                        <input type="file" name="image"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                </div>

                <button type="submit" 
                    disabled={isSubmitting}
                    className={`w-full mt-6 text-white font-bold py-2 px-4 rounded-md transition-colors ${isSubmitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}>
                    {isSubmitting ? 'Updating Manager...' : 'Update Manager'}
                </button>
            </form>
        </div>
    );
};

export default Edit;
