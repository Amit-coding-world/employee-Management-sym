import {useEffect, useState} from "react";
import {fetchDepartments} from "../../utils/EmployeeHelper";
import api from "../../utils/api";
import {useNavigate} from "react-router-dom";
import Loading from "../Loading";

const Add = () => {
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        role: "manager" // Default to manager
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getDepartments = async () => {
            const deps = await fetchDepartments();
            setDepartments(deps);
        };
        getDepartments();
    }, []);

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (name === "image") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0]
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
            formDataObj.append(key, formData[key]);
        });

        try {
            const response = await api.post('/employee/add', formDataObj);
            if (response.data.success) {
                navigate("/admin-dashboard/managers");
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (departments.length === 0 && !loading) {
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
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name"
                            onChange={handleChange}
                            placeholder="Insert Name"
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email"
                            onChange={handleChange}
                            placeholder="Insert Email"
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                        <input type="text" name="employeeId"
                            onChange={handleChange}
                            placeholder="Employee ID"
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input type="date" name="dob"
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select name="gender"
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select name="department"
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Designation</label>
                        <input type="text" name="designation"
                            onChange={handleChange}
                            placeholder="Designation"
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salary</label>
                        <input type="number" name="salary"
                            onChange={handleChange}
                            placeholder="Salary"
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password"
                            onChange={handleChange}
                            placeholder="******"
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <input type="file" name="image"
                            onChange={handleChange}
                            accept="image/*"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                    </div>
                </div>
                <button type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    {
                    loading ? "Adding..." : "Add Manager"
                } </button>
            </form>
        </div>
    );
};

export default Add;
