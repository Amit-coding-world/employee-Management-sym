import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import PrivateRoutes from "./utils/PrivateRoutes.jsx";
import RoleBaseRoutes from "./utils/RoleBaseRoutes.jsx";
import AdminSummary from "./components/dashboard/AdminSummary.jsx";
import DepartmentList from "./components/department/DepartmentList.jsx";
import AddDepartment from "./components/department/AddDepartment.jsx";
import EditDepartment from "./components/department/EditDepartment.jsx";
import List from "./components/employee/List.jsx";
import Add from "./components/employee/Add.jsx";
import Edit from "./components/employee/Edit.jsx";
import View from "./components/employee/View.jsx";
import AddSalary from "./components/salary/Add.jsx";
import ViewSalary from "./components/salary/View.jsx";
import Summary from "./components/EmployeeDashboard/Summary.jsx";
import LeaveList from "./components/leave/List.jsx";
import AddLeave from "./components/leave/Add.jsx";
import Setting from "./components/EmployeeDashboard/Setting.jsx";
import Table from "./components/leave/Table.jsx";
import Detail from "./components/leave/Detail.jsx";
import Attendance from "./components/attendance/Attendance.jsx";
import AttendanceReport from "./components/attendance/AttendanceReport.jsx";

function App() {
return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/admin-dashboard" />} ></Route>
      <Route path="/login" element={<Login />} ></Route>
      <Route path="/admin-dashboard" element={
        <PrivateRoutes>
          <RoleBaseRoutes requiredRole={["admin"]}>
            <AdminDashboard />
          </RoleBaseRoutes>
        </PrivateRoutes>
      } >
        <Route index element={<AdminSummary />} ></Route>
        <Route path="/admin-dashboard/departments" element={<DepartmentList />}  ></Route>
        <Route path="/admin-dashboard/add-department" element={<AddDepartment />}  ></Route>
        <Route path="/admin-dashboard/department/:id" element={<EditDepartment />}  ></Route>

        <Route path="/admin-dashboard/employees" element={<List />}  ></Route>
        <Route path="/admin-dashboard/add-employee" element={<Add/>}  ></Route>
        <Route path="/admin-dashboard/employees/:id" element={<View/>}  ></Route>
        <Route path="/admin-dashboard/employees/edit/:id" element={<Edit/>}  ></Route>

        <Route path="/admin-dashboard/employees/salary/:id" element={<ViewSalary/>}  ></Route>
        <Route path="/admin-dashboard/salary/add" element={<AddSalary/>} ></Route>

        <Route path="/admin-dashboard/leaves" element={<Table/>} ></Route>
        <Route path="/admin-dashboard/leaves/:id" element={<Detail/>} ></Route>
        <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveList/>} ></Route>

        <Route path="/admin-dashboard/setting" element={<Setting/>}></Route>
        <Route path="/admin-dashboard/attendance" element={<Attendance/>}></Route>
        <Route path="/admin-dashboard/attendance-report" element={<AttendanceReport/>}></Route>


        

      </Route>
      <Route path="/employee-dashboard" element={
        <PrivateRoutes>
          <RoleBaseRoutes requiredRole={["admin","employee"]}>
            <EmployeeDashboard />
        </RoleBaseRoutes>
        </PrivateRoutes>
        } >
          <Route index element={<Summary/>}></Route>
          <Route path="/employee-dashboard/profile/:id" element={<View/>}></Route>
          <Route path="/employee-dashboard/leaves/:id" element={<LeaveList/>}></Route>
          <Route path="/employee-dashboard/add-leave" element={<AddLeave/>}></Route>
          <Route path="/employee-dashboard/salary/:id" element={<ViewSalary/>}></Route>
          <Route path="/employee-dashboard/setting" element={<Setting/>}></Route>
        
        </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
