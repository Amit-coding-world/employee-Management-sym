import express from 'express';
import {
    login,
    verify,
    signup,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify', authMiddleware, verify);

export default router;
