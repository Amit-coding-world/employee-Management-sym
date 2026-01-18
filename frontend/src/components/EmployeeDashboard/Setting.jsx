import axios from 'axios';
import {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/authContext.jsx';

const Setting = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const [setting, setSetting] = useState({userId: user._id, oldPassword: "", newPassword: "", confirmPassword: ""});
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSetting({
            ...setting,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (setting.newPassword !== setting.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axios.put(`https://employee-management-system-sbvn.onrender.com/api/setting/change-password`, {
                userId: setting.userId,
                oldPassword: setting.oldPassword,
                newPassword: setting.newPassword
            }, {
                headers: {
                    Authorization: `Bearer ${
                        localStorage.getItem("token")
                    }`
                }
            });

            if (response.data.success) {
                navigate("/employee-dashboard"); // redirect after success
                setError("");
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                setError(error.response.data.message);
            } else {
                setError("Server Error");
            }
        }
    };

    return (
        <div className="p-6">
            {/* Back Button */}
            <button onClick={
                    () => navigate(-1)
                }
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                ⬅ Back
            </button>

            <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                <p className="text-red-500">
                    {error}</p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Old Password</label>
                        <input type="password" name="oldPassword" placeholder="Old Password"
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            required/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <input type="password" name="newPassword" placeholder="New Password"
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            required/>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <input type="password" name="confirmPassword" placeholder="Confirm Password"
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            required/>
                    </div>
                    <div className="mt-6">
                        <button type="submit" className="w-full bg-teal-600 text-white py-2 hover:bg-teal-700">
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Setting;
