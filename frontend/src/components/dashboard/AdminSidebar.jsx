import { NavLink } from "react-router-dom";
import {
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTachometerAlt,
  FaUsers,
  FaCogs,
  FaSignOutAlt,
} from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import { useAuth } from "../../context/authContext";

const AdminSideBar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="bg-gray-900 text-white h-screen  fixed left-0 top-0 bottom-0 w-20 md:w-64 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="bg-teal-600 h-16 flex flex-col items-center justify-center space-y-1">
          {/* Show only icon on small, full text on md+ */}
          <h3 className="text-xl font-pacific hidden md:block">Employee MS</h3>
          <p className="text-xs hidden md:block">Welcome, {user?.name}</p>
          <FaUsers className="md:hidden" size={20} />
        </div>

        {/* Nav Links */}
        <div className="space-y-2 mt-2 px-2">
          <NavLink
            to="/admin-dashboard"
            end
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center justify-center md:justify-start space-x-3 py-2 px-3 rounded`
            }
          >
            <FaTachometerAlt />
            <span className="hidden md:inline">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/employees"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center justify-center md:justify-start space-x-3 py-2 px-3 rounded`
            }
          >
            <FaUsers />
            <span className="hidden md:inline">Employee</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/departments"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center justify-center md:justify-start space-x-3 py-2 px-3 rounded`
            }
          >
            <FaBuilding />
            <span className="hidden md:inline">Department</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/leaves"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center justify-center md:justify-start space-x-3 py-2 px-3 rounded`
            }
          >
            <FaCalendarAlt />
            <span className="hidden md:inline">Leave</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/salary/add"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center justify-center md:justify-start space-x-3 py-2 px-3 rounded`
            }
          >
            <FaMoneyBillWave />
            <span className="hidden md:inline">Salary</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/attendance"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center justify-center md:justify-start space-x-3 py-2 px-3 rounded`
            }
          >
            <FaCalendarAlt />
            <span className="hidden md:inline">Attendance</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/attendance-report"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center justify-center md:justify-start space-x-3 py-2 px-3 rounded`
            }
          >
            <AiOutlineFileText />
            <span className="hidden md:inline">Attendance Report</span>
          </NavLink>

          <NavLink
            to="/admin-dashboard/setting"
            className={({ isActive }) =>
              `${isActive ? "bg-teal-500" : ""} flex items-center justify-center md:justify-start space-x-3 py-2 px-3 rounded`
            }
          >
            <FaCogs />
            <span className="hidden md:inline">Settings</span>
          </NavLink>
        </div>
      </div>

      {/* Bottom Section: Logout Icon */}
      <div className="p-4 border-t border-gray-700 flex justify-center md:justify-start">
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-full"
          title="Logout"
        >
          <FaSignOutAlt size={20} />
        </button>
        <span className="hidden md:inline ml-2">Logout</span>
      </div>
    </div>
  );
};

export default AdminSideBar;
