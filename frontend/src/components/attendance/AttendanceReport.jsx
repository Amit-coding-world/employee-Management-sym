import {useEffect, useState} from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AttendanceReport = () => {
    const [report, setReport] = useState({});
    const [limit, setLimit] = useState(5);
    const [skip, setSkip] = useState(0);
    const [dateFilter, setDateFilter] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const query = new URLSearchParams({limit, skip});
            if (dateFilter) 
                query.append("date", dateFilter);
            


            const response = await axios.get(`https://employee-management-system-sbvn.onrender.com/api/attendance/report?${
                query.toString()
            }`, {
                headers: {
                    Authorization: `Bearer ${
                        localStorage.getItem("token")
                    }`
                }
            });

            if (response.data.success) {
                if (skip === 0) {
                    setReport(response.data.groupData);
                } else {
                    setReport((prevData) => ({
                        ...prevData,
                        ... response.data.groupData
                    }));
                }
            }
            setLoading(false);
        } catch (error) {
            alert(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, [skip, dateFilter]);

    const handleLoadMore = () => setSkip((prevSkip) => prevSkip + limit);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.text("Attendance Report", 14, 15);

        let startY = 25;
        Object.entries(report).forEach(([date, records]) => {
            doc.setFontSize(12);
            doc.text(`Date: ${date}`, 14, startY);

            const tableColumn = [
                "S No",
                "Employee ID",
                "Name",
                "Department",
                "Status"
            ];
            const tableRows = records.map((data, i) => [
                i + 1,
                data.employeeId,
                data.employeeName,
                data.departmentName,
                data.status
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: startY + 5,
                margin: {
                    top: 30
                }
            });

            startY = doc.lastAutoTable.finalY + 15;
        });

        doc.save("Attendance_Report.pdf");
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-center text-3xl font-bold mb-6 text-indigo-600">
                Attendance Report
            </h2>

            {/* Filter Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <label className="text-lg font-medium">Filter by Date:</label>
                    <input type="date" className="border rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        value={dateFilter}
                        onChange={
                            (e) => setDateFilter(e.target.value)
                        }/>
                </div>
                <button onClick={downloadPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                    Download PDF
                </button>
            </div>

            {/* Report Section */}
            {
            loading ? (
                <div className="text-center text-gray-500">Loading...</div>
            ) : Object.keys(report).length === 0 ? (
                <div className="text-center text-gray-500">No records found</div>
            ) : (Object.entries(report).map(([date, record]) => (
                <div key={date}
                    className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">
                        {date}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-lg shadow-sm">
                            <thead className="bg-indigo-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">S No</th>
                                    <th className="px-4 py-2 text-left">Employee ID</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Department</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody> {
                                record.map((data, i) => (
                                    <tr key={
                                            data.employeeId
                                        }
                                        className={
                                            `hover:bg-indigo-50 ${
                                                i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                            }`
                                    }>
                                        <td className="px-4 py-2">
                                            {
                                            i + 1
                                        }</td>
                                        <td className="px-4 py-2">
                                            {
                                            data.employeeId
                                        }</td>
                                        <td className="px-4 py-2">
                                            {
                                            data.employeeName
                                        }</td>
                                        <td className="px-4 py-2">
                                            {
                                            data.departmentName
                                        }</td>
                                        <td className="px-4 py-2 font-medium">
                                            {
                                            data.status
                                        }</td>
                                    </tr>
                                ))
                            } </tbody>
                        </table>
                    </div>
                </div>
            )))
        }
            <div className="flex justify-center mt-4">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    onClick={handleLoadMore}>
                    Load More ..
                </button>
            </div>
        </div>
    );
};
export default AttendanceReport;
