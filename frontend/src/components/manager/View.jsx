import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Loading from "../Loading";
import api, {BASE_URL} from "../../utils/api";

const View = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(`/employee/${id}`);
                if (response.data.success) {
                    setEmployee(response.data.employee);
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
        fetchEmployee();
    }, [id]);

    if (loading) {
        return <Loading/>;
    }

    if (!employee) {
        return <div className="text-center mt-10 text-red-600">Manager not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
            <button onClick={
                    () => navigate(-1)
                }
                className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md">
                ← Back
            </button>
            <h2 className="text-2xl font-bold mb-8 text-center text-teal-600">Manager Details</h2>

            <div className="flex flex-col md:flex-row items-start md:space-x-10 space-y-6 md:space-y-0">
                <div className="flex-shrink-0 mx-auto md:mx-0">
                    <img src={
                            employee ?. userId ?. profileImage ? (employee.userId.profileImage.startsWith("http") ? employee.userId.profileImage : `${BASE_URL}/${
                                employee.userId.profileImage
                            }`) : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                        }
                        alt="Manager"
                        className="rounded-full border-4 border-teal-500 w-48 md:w-64 object-cover h-48 md:h-64 shadow-lg"/>
                </div>

                <div className="flex-1 space-y-5">
                    <div className="flex space-x-3 border-b pb-2">
                        <p className="text-lg font-bold text-teal-700">Name:</p>
                        <p className="font-medium text-gray-800">
                            {
                            employee ?. userId ?. name
                        }</p>
                    </div>
                    <div className="flex space-x-3 border-b pb-2">
                        <p className="text-lg font-bold text-teal-700">Employee ID:</p>
                        <p className="font-medium text-gray-800">
                            {
                            employee ?. employeeId
                        }</p>
                    </div>
                    <div className="flex space-x-3 border-b pb-2">
                        <p className="text-lg font-bold text-teal-700">Role:</p>
                        <p className="font-medium text-gray-800 capitalize">
                            {
                            employee ?. userId ?. role
                        }</p>
                    </div>
                    <div className="flex space-x-3 border-b pb-2">
                        <p className="text-lg font-bold text-teal-700">Date of Birth:</p>
                        <p className="font-medium text-gray-800">
                            {
                            employee ?. dob ? new Date(employee.dob).toLocaleDateString() : "N/A"
                        } </p>
                    </div>
                    <div className="flex space-x-3 border-b pb-2">
                        <p className="text-lg font-bold text-teal-700">Gender:</p>
                        <p className="font-medium text-gray-800 capitalize">
                            {
                            employee ?. gender
                        }</p>
                    </div>
                    <div className="flex space-x-3 border-b pb-2">
                        <p className="text-lg font-bold text-teal-700">Department:</p>
                        <p className="font-medium text-gray-800">
                            {
                            employee ?. department ?. dep_name
                        }</p>
                    </div>
                    <div className="flex space-x-3 border-b pb-2">
                        <p className="text-lg font-bold text-teal-700">Marital Status:</p>
                        <p className="font-medium text-gray-800 capitalize">
                            {
                            employee ?. maritalStatus
                        }</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default View;
