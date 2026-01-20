import {useState} from "react";
import {useAuth} from "../../context/authContext";
import api from "../../utils/api";
import {useNavigate} from "react-router-dom";

const Add = () => {
    const {user} = useAuth();
    const [leave, setLeave] = useState({userId: user._id});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setLeave((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post(`/leave/add`, leave);
            if (response.data.success) {
                navigate(`/employee-dashboard/leaves/${
                    user._id
                }`);
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

    return (
        <div className="max-w-xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            {/* Back Button */}
            <div className="mb-4">
                <button onClick={
                        () => navigate(-1)
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition">
                    ← Back
                </button>
            </div>

            <h2 className="text-2xl font-bold mb-6">Request for Leave</h2>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col space-y-4">
                    {/* Leave Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Leave Type
                        </label>
                        <select name="leaveType"
                            value={
                                leave.leaveType || ""
                            }
                            onChange={handleChange}
                            required
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md">
                            <option value="">Select Leave Type</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Casual Leave">Casual Leave</option>
                            <option value="Annual Leave">Annual Leave</option>
                        </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                From Date
                            </label>
                            <input type="date" name="startDate"
                                value={
                                    leave.startDate || ""
                                }
                                onChange={handleChange}
                                required
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                To Date
                            </label>
                            <input type="date" name="endDate"
                                value={
                                    leave.endDate || ""
                                }
                                onChange={handleChange}
                                required
                                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"/>
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea name="reason"
                            value={
                                leave.reason || ""
                            }
                            placeholder="Reason for leave"
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md p-2"
                            rows="3"></textarea>
                    </div>
                </div>

                <button type="submit"
                    disabled={loading}
                    className={
                        `w-full mt-6 bg-teal-600 text-white font-bold py-2 px-4 rounded-md ${
                            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700"
                        }`
                }>
                    {
                    loading ? "Submitting..." : "Add Leave"
                } </button>
            </form>
        </div>
    );
};

export default Add;
