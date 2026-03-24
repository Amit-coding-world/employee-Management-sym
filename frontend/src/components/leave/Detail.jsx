import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api, { BASE_URL } from "../../utils/api";
import Loading from "../Loading";
import { useAuth } from "../../context/authContext";

const Detail = () => {
    const { id } = useParams();
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchLeave = async () => {
            try {
                const response = await api.get(`/leave/detail/${id}`);
                if (response.data.success) {
                    setLeave(response.data.leave);
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
        fetchLeave();
    }, [id]);

    const changeStatus = async (id, status) => {
        setUpdating(true);
        try {
            const response = await api.put(`/leave/${id}`, { status });
            if (response.data.success) {
                navigate("/admin-dashboard/leaves");
            }
        } catch (error) {
            console.error(error.message);
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!leave) {
        return <div className="text-center mt-10 text-red-600">Leave not found</div>;
    }

    const canAction = user && leave && (
        (user.role === 'manager' && 
         leave.status === 'Pending' && 
         leave.employeeId?.userId?.role !== 'manager' && 
         leave.employeeId?.userId?._id?.toString() !== user._id.toString()
        ) ||
        (user.role === 'admin' && (leave.status === 'Pending' || leave.status === 'Manager Approved'))
    );

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
                ← Back
            </button>
            <h2 className="text-2xl font-bold mb-8 text-center">Leave Details</h2>

            <div className="flex flex-col md:flex-row items-start md:space-x-10 space-y-6 md:space-y-0">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                    <img src={leave?.employeeId?.userId?.profileImage ? (leave.employeeId.userId.profileImage.startsWith("http") ? leave.employeeId.userId.profileImage : `${BASE_URL}/${leave.employeeId.userId.profileImage}`) : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                        className="rounded-full border w-40 h-40 object-cover"
                        alt="Profile" />
                </div>

                <div className="flex-grow space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><p className="text-lg font-bold">Name: <span className="font-medium text-gray-700">{leave?.employeeId?.userId?.name}</span></p></div>
                        <div><p className="text-lg font-bold">Employee ID: <span className="font-medium text-gray-700">{leave?.employeeId?.employeeId}</span></p></div>
                        <div><p className="text-lg font-bold">Leave Type: <span className="font-medium text-gray-700">{leave?.leaveType}</span></p></div>
                        <div><p className="text-lg font-bold">Reason: <span className="font-medium text-gray-700">{leave?.reason}</span></p></div>
                        <div><p className="text-lg font-bold">Department: <span className="font-medium text-gray-700">{leave?.employeeId?.department?.dep_name}</span></p></div>
                        <div><p className="text-lg font-bold">Start Date: <span className="font-medium text-gray-700">{new Date(leave?.startDate).toLocaleDateString()}</span></p></div>
                        <div><p className="text-lg font-bold">End Date: <span className="font-medium text-gray-700">{new Date(leave?.endDate).toLocaleDateString()}</span></p></div>
                    </div>

                    <div className="flex space-x-3 items-center pt-4">
                        <p className="text-lg font-bold">{canAction ? "Action:" : "Status:"}</p>
                        {canAction ? (
                            <div className="flex space-x-2">
                                <button disabled={updating} onClick={() => changeStatus(leave._id, "Approved")} className={`bg-green-500 text-white px-4 py-1 rounded-md ${updating ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"}`}>
                                    {user.role === 'manager' ? "Manager Approve" : "Approve"}
                                </button>
                                <button disabled={updating} onClick={() => changeStatus(leave._id, "Rejected")} className={`bg-red-500 text-white px-4 py-1 rounded-md ${updating ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"}`}>
                                    Reject
                                </button>
                            </div>
                        ) : (
                            <p className="text-lg font-medium text-gray-700">{leave?.status}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;
