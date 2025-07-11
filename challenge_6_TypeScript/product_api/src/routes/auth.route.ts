// src/routes/auth.route.ts
import { Router } from 'express';
import { register, verifyOTP, login } from '../controllers/auth.controller';
import { validateRegister, validateVerifyOTP, validateLogin } from '../middleware/validation';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     description: Đăng ký tài khoản bằng email và mật khẩu, sau đó gửi mã OTP về email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Gửi OTP thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "OTP đã được gửi đến email của bạn" }
 *       400:
 *         description: Lỗi xác thực dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Email đã tồn tại trong hệ thống" }
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Lỗi server, vui lòng thử lại sau" }
 */
router.post('/register', validateRegister, register);

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Xác thực mã OTP
 *     description: Xác thực mã OTP gửi về email để kích hoạt tài khoản
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               otp: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Xác thực thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Tài khoản đã được xác thực thành công" }
 *       400:
 *         description: OTP không hợp lệ hoặc đã hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "OTP không hợp lệ hoặc đã hết hạn" }
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Lỗi server, vui lòng thử lại sau" }
 */
router.post('/verify-otp', validateVerifyOTP, verifyOTP);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     description: Đăng nhập bằng email và mật khẩu, trả về JWT token nếu thành công
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "user@example.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Đăng nhập thành công" }
 *                 token: { type: string, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
 *       401:
 *         description: Đăng nhập thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Email không tồn tại trong hệ thống" }
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 message: { type: string, example: "Lỗi server, vui lòng thử lại sau" }
 */
router.post('/login', validateLogin, login);

export default router;
