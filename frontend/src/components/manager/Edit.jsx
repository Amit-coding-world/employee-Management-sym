import {useEffect, useState} from "react";
import {fetchDepartments} from "../../utils/EmployeeHelper";
import api, {BASE_URL} from "../../utils/api";
import {useNavigate, useParams} from "react-router-dom";
import Loading from "../Loading";

const Edit = () => {
    const [employee, setEmployee] = useState({
        name: "",
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
                const response = await api.get(`/employee/${id}`);
                if (response.data.success) {
                    const emp = response.data.employee;
                    setEmployee({
                        name: emp ?. userId ?. name || "",
                        maritalStatus: emp.maritalStatus || "",
                        designation: emp.designation || "",
                        salary: emp.salary || "",
                        department: emp.department ?. _id || emp.department || "",
                        profileImage: emp ?. userId ?. profileImage || ""
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataObj = new FormData();
        Object.keys(employee).forEach((key) => {
            formDataObj.append(key, employee[key]);
        });

        try {
            const response = await api.put(`/employee/${id}`, formDataObj);
            if (response.data.success) {
                navigate("/admin-dashboard/managers");
            }
        } catch (error) {
            console.error(error.message);
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error || "Update failed");
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

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                }</option>
                            ))
                        } </select>
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
                            onChange={handleChange}
                            accept="image/*"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                </div>

                <button type="submit" className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Update Manager
                </button>
            </form>
        </div>
    );
};

export default Edit;
