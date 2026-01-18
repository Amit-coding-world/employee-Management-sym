import express from "express";
import {
    attendanceReport,
    getAttendance,
    updateAttendance,
    getAttendanceByEmployeeId,
    getAttendanceByUser
} from "../controllers/attendanceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import defaultAttendance from "../middleware/defaultAttendance.js";

const router = express.Router();

router.get("/", authMiddleware, defaultAttendance, getAttendance);
router.put('/update/:employeeId', authMiddleware, updateAttendance)
router.get('/report', authMiddleware, attendanceReport)
router.get('/user-status', authMiddleware, getAttendanceByUser);
router.get('/:id', authMiddleware, getAttendanceByEmployeeId);

export default router;
