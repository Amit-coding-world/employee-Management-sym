import mongoose from "mongoose";
import {Schema} from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    status: {
        type: String,
        enum: [
            "Present", "Absent", "Sick", "Leave"
        ],
        default: null
    }
})

const Attendance = mongoose.model("Attendance", AttendanceSchema)
export default Attendance;
