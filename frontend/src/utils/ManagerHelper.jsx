import api from "./api";
import {useNavigate} from "react-router-dom";

export const columns = [
    {
        name: "S No.",
        selector: (row) => row.sno,
        width: "70px"
    },
    {
        name: "Name",
        selector: (row) => row.name,
        sortable: true,
        width: "150px"
    },
    {
        name: "Image",
        selector: (row) => row.profileImage,
        width: "90px"
    },
    {
        name: "Department",
        selector: (row) => row.dep_name,
        sortable: true,
        width: "150px"
    }, {
        name: "Action",
        selector: (row) => row.action,
        center: "true"
    },
];

import {useAuth} from "../context/authContext";

export const ManagerButtons = ({_id, userId, onManagerDelete}) => {
    const navigate = useNavigate();
    const {user} = useAuth();
    
    // Check if the current user is a manager and not the owner of this record
    const isDisabled = user && user.role === "manager" && user._id !== userId;

    return (
        <div className="flex space-x-3">
            <button className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                onClick={() => navigate(`/admin-dashboard/managers/${_id}`)}>
                View
            </button>
            <button 
                className={`px-3 py-1 text-white rounded transition ${isDisabled ? 'bg-yellow-300 cursor-not-allowed opacity-50' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                onClick={() => !isDisabled && navigate(`/admin-dashboard/managers/edit/${_id}`)}
                disabled={isDisabled}
            >
                Edit
            </button>
            <button 
                className={`px-3 py-1 text-white rounded transition ${isDisabled ? 'bg-red-300 cursor-not-allowed opacity-50' : 'bg-red-600 hover:bg-red-700'}`}
                onClick={() => !isDisabled && navigate(`/admin-dashboard/employees/salary/${_id}`)}
                disabled={isDisabled}
            >
                Salary
            </button>
            <button 
                className={`px-3 py-1 text-white rounded transition ${isDisabled ? 'bg-purple-300 cursor-not-allowed opacity-50' : 'bg-purple-600 hover:bg-purple-700'}`}
                onClick={() => !isDisabled && navigate(`/admin-dashboard/leaves/add/${_id}`)}
                disabled={isDisabled}
            >
                Leave
            </button>
            {user && user.role === "admin" && (
                <button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                    onClick={() => onManagerDelete(_id)}>
                    Delete
                </button>
            )}
        </div>
    );
};
