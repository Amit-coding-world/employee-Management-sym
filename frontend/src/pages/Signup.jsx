import api from "../utils/api";
import {useState} from "react";
import {useNavigate, Link} from 'react-router-dom';
import Loading from "../components/Loading";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        companyName: '',
        companyDescription: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post(`/auth/signup`, formData);
            if (response.data.success) {
                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.data && !error.response.data.success) {
                setError(error.response.data.error || error.response.data.message);
            } else {
                setError("Server Error");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading/>;
    }


    return (
        <div className="flex flex-col items-center min-h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6 py-12">
            <h2 className="font-sevillana text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-lg tracking-wide">
                Employee Management System
            </h2>

            <div className="border shadow p-6 w-96 bg-white overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-4">Register Your Company</h2>
                {
                error && <p className="text-red-500 mb-4">
                    {error}</p>
            }
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Admin Name:</label>
                        <input type="text" name="name" placeholder="Enter Name" required className="w-full px-3 py-2 border"
                            onChange={handleChange}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email:</label>
                        <input type="email" name="email" placeholder="Enter Email" required className="w-full px-3 py-2 border"
                            onChange={handleChange}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Password:</label>
                        <input type="password" name="password" placeholder="******" required className="w-full px-3 py-2 border"
                            onChange={handleChange}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role:</label>
                        <select name="role" required className="w-full px-3 py-2 border"
                            onChange={handleChange}
                            value={
                                formData.role
                        }>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="mb-4 border-t pt-4">
                        <label className="block text-gray-700 font-semibold mb-2">Company Details</label>
                        <label className="block text-gray-700">Company Name:</label>
                        <input type="text" name="companyName" placeholder="Enter Company Name" required className="w-full px-3 py-2 border"
                            onChange={handleChange}/>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description:</label>
                        <textarea name="companyDescription" placeholder="Briefly describe your company" className="w-full px-3 py-2 border"
                            onChange={handleChange}></textarea>
                    </div>
                    <div className="mb-4">
                        <button type="submit" className="w-full bg-teal-600 text-white py-2 hover:bg-teal-700 ">
                            Register
                        </button>
                    </div>
                    <p className="text-center">
                        Already have an account?
                        <Link to="/login" className="text-teal-600">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
