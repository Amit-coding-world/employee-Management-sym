import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import api, {BASE_URL} from "../../utils/api";
import {columns, EmployeeButtons} from "../../utils/EmployeeHelper";
import DataTable from "react-data-table-component";

const List = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filteredManagers, setFilteredManagers] = useState([]);

    useEffect(() => {
        const fetchManagers = async () => {
            setLoading(true);
            try {
                const response = await api.get('/employee');
                if (response.data.success) {
                    let sno = 1;
                    const data = response.data.employees.filter(emp => emp.userId.role === 'manager').map((emp) => ({
                        _id: emp._id,
                        sno: sno++,
                        dep_name: emp ?. department ?. dep_name || "N/A",
                        name: emp ?. userId ?. name || "N/A",
                        dob: emp ?. dob ? new Date(emp.dob).toLocaleDateString() : "N/A",
                        profileImage: (
                            <img width={40}
                                className="rounded-full"
                                src={
                                    emp ?. userId ?. profileImage ? (emp.userId.profileImage.startsWith("http") ? emp.userId.profileImage : `${BASE_URL}/${
                                        emp.userId.profileImage
                                    }`) : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                }
                                alt={
                                    emp ?. userId ?. name || "Manager"
                                }/>
                        ),
                        action: <EmployeeButtons _id={
                            emp._id
                        }/>
                    }));
                    setManagers(data);
                    setFilteredManagers(data);
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
        fetchManagers();
    }, []);

    const handleFilter = (e) => {
        const searchValue = e.target.value.toLowerCase();
        const records = managers.filter((manager) => manager.name.toLowerCase().includes(searchValue));
        setFilteredManagers(records);
    };

    return (
        <div className="p-6">
            <div className="text-center p-6">
                <h3 className="text-2xl font-bold text-teal-600">Manage Managers</h3>
            </div>

            <div className="flex justify-between items-center mb-4">
                <input type="text" placeholder="Search By Manager Name" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    onChange={handleFilter}/>
                <Link to="/admin-dashboard/add-employee" className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-md">
                    Add New Manager
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg transition-all">
                {
                loading ? (
                    <Loading/>) : filteredManagers.length > 0 ? (
                    <DataTable columns={columns}
                        data={filteredManagers}
                        pagination
                        highlightOnHover/>
                ) : (
                    <div className="p-10 text-center text-gray-500">No managers found</div>
                )
            } </div>
        </div>
    );
};

export default List;
