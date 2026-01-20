import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import api from "../../utils/api";
import {columns, AttendanceHelper} from "../../utils/AttendanceHelper";
import DataTable from "react-data-table-component";
import Loading from "../Loading";

const Attendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

    const statusChange = () => {
        fetchAttendance(false);
    };

    const fetchAttendance = async (showLoading = true) => {
        if (showLoading) 
            setLoading(true);
        


        try {
            const response = await api.get(`/attendance?date=${selectedDate}`);

            if (response.data.success) {
                let sno = 1;
                const data = response.data.attendance.map((att) => ({
                    sno: sno++,
                    employeeId: att.employeeId.employeeId,
                    department: att.employeeId.department.dep_name,
                    name: att.employeeId.userId.name,
                    action: (
                        <AttendanceHelper status={
                                att.status
                            }
                            employeeId={
                                att.employeeId.employeeId
                            }
                            statusChange={statusChange}
                            date={selectedDate}/>
                    )
                }));
                setAttendance(data);
                setFilteredAttendance(data);
            }
        } catch (error) {
            const message = error.response ?. data ?. error || error.message;
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [selectedDate]);

    const handleFilter = (e) => {
        const records = attendance.filter((emp) => emp.employeeId.toLowerCase().includes(e.target.value.toLowerCase()));
        setFilteredAttendance(records);
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="p-6">
            <div className="text-center p-6">
                <h3 className="text-2xl font-bold font-pacific text-teal-700">Manage Attendance</h3>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-4 bg-white p-4 rounded-lg shadow-sm">
                <input type="text" placeholder="Search By Emp ID" className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 w-full md:w-auto"
                    onChange={handleFilter}/>
                
                <div className="flex items-center space-x-3 bg-teal-50 px-4 py-2 rounded-full border border-teal-100">
                    <span className="text-teal-800 font-medium">Mark Attendance for: </span>
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent border-none outline-none text-teal-900 font-bold cursor-pointer"
                    />
                </div>

                <Link to="/admin-dashboard/attendance-report" className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 transition shadow-md hover:shadow-lg">
                    Attendance Report
                </Link>
            </div>
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <DataTable columns={columns}
                    data={filteredAttendance}
                    pagination
                    customStyles={{
                        headRow: {
                            style: {
                                backgroundColor: '#f0fdfa',
                                color: '#0f766e',
                                fontWeight: 'bold'
                            }
                        }
                    }}
                    />
            </div>
        </div>
    );
};

export default Attendance;
