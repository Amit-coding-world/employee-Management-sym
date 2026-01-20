import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import api, {BASE_URL} from "../../utils/api";
import Loading from "../Loading";

const Detail = () => {
    const {id} = useParams();
    const [leave, setLeave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

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
            const response = await api.put(`/leave/${id}`, {status});
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
        return <Loading/>;
    }

    if (!leave) {
        return <div className="text-center mt-10 text-red-600">
            Leave not found
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            {/ * Back Button * /}
            <button onClick={
                    () => navigate(-1)
                }
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
                ← Back
            </button>
            {/* Title */}
            <h2 className="text-2xl font-bold mb-8 text-center">
                Leave Details
            </h2>

            {/ * Two - column layout * /}
            <div className="flex flex-col md:flex-row items-start md:space-x-10 space-y-6 md:space-y-0">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                    <img src={
                            leave ?. employeeId ?. userId ?. profileImage ? (leave.employeeId.userId.profileImage.startsWith("http") ? leave.employeeId.userId.profileImage : `${BASE_URL}/${
                                leave.employeeId.userId.profileImage
                            }`) : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        className="rounded-full border w-48 md:w-64"
                        alt={
                            leave ?. employeeId ?. userId ?. name || "Profile"
                        }/>
                </div>

                {/* Right: Details */}
                <div className="flex-1 space-y-5">
                    <div className="flex space-x-3">
                        <p className="text-lg font-bold">Name:</p>
                        <p className="font-medium">
                            {
                            leave ?. employeeId ?. userId ?. name
                        }</p>
                    </div>
                    <div className="flex space-x-3">
                        <p className="text-lg font-bold">Employee ID:</p>
                        <p className="font-medium">
                            {
                            leave ?. employeeId ?. employeeId
                        }</p>
                    </div>
                    <div className="flex space-x-3">
                        <p className="text-lg font-bold">Leave Type:</p>
                        <p className="font-medium">
                            {
                            leave ?. leaveType
                        }</p>
                    </div>
                    <div className="flex space-x-3">
                        <p className="text-lg font-bold">Reason:</p>
                        <p className="font-medium">
                            {
                            leave ?. reason
                        }</p>
                    </div>
                    <div className="flex space-x-3">
                        <p className="text-lg font-bold">Department:</p>
                        <p className="font-medium">
                            {
                            leave ?. employeeId ?. department ?. dep_name
                        }</p>
                    </div>
                    <div className="flex space-x-3">
                        <p className="text-lg font-bold">Start Date:</p>
                        <p className="font-medium">
                            {
                            leave ?. startDate ? new Date(leave.startDate).toLocaleDateString() : "N/A"
                        } </p>
                    </div>
                    <div className="flex space-x-3">
                        <p className="text-lg font-bold">End Date:</p>
                        <p className="font-medium">
                            {
                            leave ?. endDate ? new Date(leave.endDate).toLocaleDateString() : "N/A"
                        } </p>
                    </div>
                    <div className="flex space-x-3 items-center">
                        <p className="text-lg font-bold">
                            {
                            leave ?. status === "Pending" ? "Action" : "Status"
                        } </p>
                        {
                        leave ?. status === "Pending" ? (
                            <div className="flex space-x-2">
                                <button disabled={updating}
                                    className={
                                        ` bg - green - 500 text - white px - 2 rounded - md ${
                                            updating ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                                        }`
                                    }
                                    onClick={
                                        () => changeStatus(leave._id, "Approved")
                                }>
                                    Approve
                                </button>
                                <button disabled={updating}
                                    className={
                                        ` bg - red - 500 text - white px - 2 rounded - md ${
                                            updating ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
                                        }`
                                    }
                                    onClick={
                                        () => changeStatus(leave._id, "Rejected")
                                }>
                                    Reject
                                </button>
                            </div>
                        ) : (
                            <p className="font-medium">
                                {
                                leave ?. status
                            }</p>
                        )
                    } </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;
