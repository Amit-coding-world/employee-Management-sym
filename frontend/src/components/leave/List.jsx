import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import api from "../../utils/api";
import Loading from "../Loading";
import { useAuth } from "../../context/authContext";

const List = () => {
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const {id} = useParams();
    const {user, loading: authLoading} = useAuth();

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/leave/${id}/${
                user.role
            }`);
            if (response.data.success) {
                setLeaves(response.data.leaves);
                setFilteredLeaves(response.data.leaves);
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

    useEffect(() => {
        if (user) {
            fetchLeaves();
        }
    }, [user, id]);

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const records = leaves.filter((leave) => leave ?. employeeId ?. userId ?. name ?. toLowerCase().includes(searchValue));
        setFilteredLeaves(records);
    };

    const renderStatusBadge = (status) => {
        let colorClass = "";
        switch (status) {
            case "Approved": colorClass = "bg-green-100 text-green-700";
                break;
            case "Rejected": colorClass = "bg-red-100 text-red-700";
                break;
            default: colorClass = "bg-yellow-100 text-yellow-700";
        }
        return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}>
                {status}
            </span>
        );
    };

    if (authLoading || loading) {
        return <Loading/>;
    }

    return (
        <div className="p-6">
            <div className="text-center p-6">
                <h3 className="text-2xl font-bold">Manage Leaves</h3>
            </div>

            <div className="flex justify-between items-center my-4">
                <input type="text" placeholder="Search By Employee Name" className="px-4 py-1 border border-gray-300 rounded-md"
                    onChange={handleSearch}/>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                        <tr>
                            <th className="px-6 py-3">S No.</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Leave Type</th>
                            <th className="px-6 py-3">From</th>
                            <th className="px-6 py-3">To</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Status</th>
                            {user.role !== 'employee' && <th className="px-6 py-3">Action</th>}
                        </tr>
                    </thead>
                    <tbody> {
                        filteredLeaves.map((leave, index) => (
                            <tr key={
                                    leave._id
                                }
                                className="bg-white border-b hover:bg-gray-100">
                                <td className="px-6 py-3 font-bold">
                                    {
                                    index + 1
                                }</td>
                                <td className="px-6 py-3 font-bold">
                                    {
                                    leave ?. employeeId ?. userId ?. name || "N/A"
                                } </td>
                                <td className="px-6 py-3 font-bold">
                                    {
                                    leave.leaveType
                                }</td>
                                <td className="px-6 py-3 font-bold">
                                    {
                                    leave ?. startDate ? new Date(leave.startDate).toLocaleDateString() : "N/A"
                                } </td>
                                <td className="px-6 py-3 font-bold">
                                    {
                                    leave ?. endDate ? new Date(leave.endDate).toLocaleDateString() : "N/A"
                                } </td>
                                <td className="px-6 py-3 font-bold">
                                    {
                                    leave.reason
                                }</td>
                                <td className="px-6 py-3 font-bold">
                                    {
                                    renderStatusBadge(leave.status)
                                } </td>
                                {user.role !== 'employee' && (
                                     <td className="px-6 py-3 font-bold text-center">
                                     <button
                                         onClick={() => navigate(`/admin-dashboard/leaves/${leave._id}`)}
                                         className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600"
                                     >
                                         View
                                     </button>
                                 </td>
                                )}
                            </tr>
                        ))
                    } </tbody>
                </table>
            </div>
        </div>
    );
};

export default List;
