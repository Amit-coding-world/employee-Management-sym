import api from '../utils/api.js';
import {useState} from "react";
import {useNavigate, useLocation, Link} from 'react-router-dom';

const ResetPassword = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: location.state ?. email || '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }
        try {
            const response = await api.post(`/auth/reset-password`, {
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            if (response.data.success) {
                setMessage(response.data.message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                setError(error.response.data.error);
            } else {
                setError("Server Error");
            }
        }
    };

    return (<div className="flex flex-col items-center h-screen justify-center bg-gradient-to-b from-teal-600 from-50% to-gray-100 to-50% space-y-6">
        <h2 className="font-sevillana text-2xl md:text-3xl lg:text-4xl text-white drop-shadow-lg tracking-wide">
            Employee Management System
        </h2>

        <div className="border shadow p-6 w-80 bg-white">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            {
            error && <p className="text-red-500 mb-4"> {error}</p>
        }
            {
            message && <p className="text-green-500 mb-4"> {message}</p>
        }
            <form onSubmit={handleSubmit}> {
                ! location.state ?. email && (<div className="mb-4">
                    <label className="block text-gray-700">Email:</label>
                    <input type="email" name="email"
                        value={
                            formData.email
                        }
                        placeholder="Enter Email"
                        required
                        className="w-full px-3 py-2 border"
                        onChange={handleChange}/>
                </div>)
            }
                <div className="mb-4">
                    <label className="block text-gray-700">OTP:</label>
                    <input type="text" name="otp" placeholder="Enter 6-digit OTP" required className="w-full px-3 py-2 border"
                        onChange={handleChange}/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">New Password:</label>
                    <input type="password" name="newPassword" placeholder="******" required className="w-full px-3 py-2 border"
                        onChange={handleChange}/>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Confirm Password:</label>
                    <input type="password" name="confirmPassword" placeholder="******" required className="w-full px-3 py-2 border"
                        onChange={handleChange}/>
                </div>
                <div className="mb-4">
                    <button type="submit" className="w-full bg-teal-600 text-white py-2 hover:bg-teal-700 ">
                        Reset Password
                    </button>
                </div>
            </form>
        </div>
    </div>);
};

export default ResetPassword;
