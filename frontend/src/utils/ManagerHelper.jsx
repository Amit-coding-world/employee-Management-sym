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

export const ManagerButtons = ({_id}) => {
    const navigate = useNavigate();
    return (
        <div className="flex space-x-3">
            <button className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                onClick={
                    () => navigate(`/admin-dashboard/managers/${_id}`)
            }>
                View
            </button>
            <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                onClick={
                    () => navigate(`/admin-dashboard/managers/edit/${_id}`)
            }>
                Edit
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={
                    () => navigate(`/admin-dashboard/employees/salary/${_id}`)
            }>
                Salary
            </button>
            <button className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                onClick={
                    () => navigate(`/admin-dashboard/employees/leaves/${_id}`)
            }>
                Leave
            </button>
        </div>
    );
};
