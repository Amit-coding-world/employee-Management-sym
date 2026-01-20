import {useEffect, useState} from "react";
import api from "../../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loading from "../Loading";

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
            

            const response = await api.get(`/attendance/report?${
                query.toString()
            }`);

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
            <h2 className="text-center text-3xl font-bold mb-6 text-teal-600 font-pacific">
                Attendance Report
            </h2>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                    <label className="text-lg font-medium text-teal-800">Filter by Date:</label>
                    <input type="date" className="border border-teal-200 rounded-full px-4 py-2 bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        value={dateFilter}
                        onChange={
                            (e) => {
                                setDateFilter(e.target.value);
                                setSkip(0); // Reset skip when filter changes
                            }
                        }/>
                </div>
            <button onClick={downloadPDF}
                className="px-6 py-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition shadow-md hover:shadow-lg flex items-center">
                Download PDF
            </button>
        </div>

        {/* Report Section */}
        <div className="space-y-8">
            {
            loading && skip === 0 ? (
                <Loading/>) : Object.keys(report).length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-dashed border-gray-300">No records found</div>
            ) : (Object.entries(report).map(([date, record]) => (
                <div key={date}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-teal-600 px-6 py-3">
                        <h2 className="text-lg font-bold text-white">
                            {date} </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-teal-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">S No</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">Employee ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">Department</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-teal-700 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {
                                record.map((data, i) => (
                                    <tr key={
                                            data.employeeId
                                        }
                                        className="hover:bg-teal-50/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {
                                            i + 1
                                        } </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                            {
                                            data.employeeId
                                        } </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {
                                            data.employeeName
                                        } </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {
                                            data.departmentName
                                        } </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={
                                                `px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                                    data.status === 'present' ? 'bg-green-100 text-green-700' : data.status === 'absent' ? 'bg-red-100 text-red-700' : data.status === 'sick' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                                }`
                                            }>
                                                {
                                                data.status || "Not Marked"
                                            } </span>
                                        </td>
                                    </tr>
                                ))
                            } </tbody>
                        </table>
                    </div>
                </div>
            )))
        } </div>

        {
        !loading && Object.keys(report).length > 0 && (
            <div className="flex justify-center mt-10 pb-10">
                <button className="px-8 py-3 bg-white border-2 border-teal-600 text-teal-600 font-bold rounded-full hover:bg-teal-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-md"
                    onClick={handleLoadMore}>
                    Load More Records
                </button>
            </div>
        )
    }

        {
        loading && skip > 0 && (
            <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        )
    } </div>
    );
};
export default AttendanceReport;
