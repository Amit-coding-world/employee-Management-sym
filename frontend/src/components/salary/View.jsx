import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";

const View = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const {user}= useAuth()

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(`https://employee-management-system-sbvn.onrender.com/api/salary/${id}/${user.role}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.message);
      }
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const filterSalaries = (q) => {
    const filteredRecords = salaries.filter((record) =>
      record.employeeId?.employeeId?.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };

  return (
    <>
      {filteredSalaries === null ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto p-5">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
          >
            ← Back
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold">Salary History</h2>
          </div>

          <div className="flex justify-end my-3">
            <input
              type="text"
              placeholder="Search By Emp ID"
              className="border px-2 rounded-md py-0.5 border-gray-300"
              onChange={(e) => filterSalaries(e.target.value)}
            />
          </div>

          {filteredSalaries.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200">
                <tr>
                  <th className="px-6 py-3">SNO</th>
                  <th className="px-6 py-3">Emp ID</th>
                  <th className="px-6 py-3">Salary</th>
                  <th className="px-6 py-3">Allowance</th>
                  <th className="px-6 py-3">Deduction</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary, index) => (
                  <tr
                    key={salary._id}
                    className="bg-white border-b hover:bg-gray-100"
                  >
                    <td className="px-6 py-3 font-bold">{index + 1}</td>
                    <td className="px-6 py-3 font-bold">{salary.employeeId?.employeeId}</td>
                    <td className="px-6 py-3 font-bold">{salary.basicSalary}</td>
                    <td className="px-6 py-3 font-bold">{salary.allowances}</td>
                    <td className="px-6 py-3 font-bold">{salary.deductions}</td>
                    <td className="px-6 py-3 font-bold">{salary.netSalary}</td>
                    <td className="px-6 py-3 font-bold">
                      {new Date(salary.payDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No Records</div>
          )}
        </div>
      )}
    </>
  );
};

export default View;

