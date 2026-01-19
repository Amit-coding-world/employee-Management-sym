import axios from 'axios';
import {useState} from "react";
import {useAuth} from '../context/authContext.jsx';
import {useNavigate, Link} from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            const response = await axios.post(`https://employee-management-system-sbvn.onrender.com/api/auth/login`, {email, password});
            if (response.data.success) {
                login(response.data.user)
                localStorage.setItem("token", response.data.token);
                if (response.data.user.role === 'admin') {
                    navigate('/admin-dashboard');
                } else {
                    navigate("/employee-dashboard")
                }
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                setError(error.response.data.message);
            } else {
                setError("Server Error");
            }
        }
    }

    return (<div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
        <h2 className="font-sevillana text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-lg tracking-wide">
            Employee Management System
        </h2>

        <div className="border shadow p-6 w-80 bg-white">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {
            error && <p className="text-red-500 mb-4 text-xl"> {error}</p>
        }
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                        Email:
                    </label>
                    <input type="email" id="email" name="email" placeholder="Enter Email" required className="w-full px-3 py-2 border"
                        onChange={
                            (e) => setEmail(e.target.value)
                        }/>
                </div>
                <div>
                    <label htmlFor="password" className="block text-gray-700">
                        Password:
                    </label>
                    <input type="password" id="password" name="password" placeholder="******" required className="w-full px-3 py-2 border"
                        onChange={
                            (e) => setPassword(e.target.value)
                        }/>
                </div>
                <div className="mb-4 flex items-center justify-between">
                    <label className="inline-flex items-center mt-3">
                        <input type="checkbox" className="form-checkbox"/>
                        <span className="ml-2 text-gray-700">Remember Me</span>
                    </label>
                    <Link to="/forgot-password" className="text-teal-600 cursor-pointer mt-3 hover:text-teal-900">
                        Forgot Password?
                    </Link>
                </div>
                <div className="mb-4">
                    <button type="submit" className="w-full bg-teal-600 text-white py-2 hover:bg-teal-700 ">
                        Login
                    </button>
                </div>
                <p className="text-center">
                    Don't have an account?
                    <Link to="/signup" className="text-teal-600 ml-1">Sign Up</Link>
                </p>
            </form>
        </div>
    </div>);
};

export default Login;
