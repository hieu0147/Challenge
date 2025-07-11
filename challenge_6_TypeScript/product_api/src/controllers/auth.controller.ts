// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db';
import dotenv from 'dotenv';
import { sendOTPEmail } from '../config/mailer';

dotenv.config();

// Đăng ký người dùng và gửi OTP
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Kiểm tra email đã tồn tại
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Email đã tồn tại trong hệ thống'
            });
            return;
        }

        const hashed = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const result = await pool.query(
            `INSERT INTO users (email, password, otp, otp_expires_at) 
             VALUES ($1, $2, $3, NOW() + INTERVAL '10 minutes') RETURNING *`,
            [email, hashed, otp]
        );

        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP đã được gửi đến email của bạn'
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
        });
    }
};

// Xác minh OTP
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1 AND otp = $2 AND otp_expires_at > NOW()`,
            [email, otp]
        );

        if (result.rows.length === 0) {
            res.status(400).json({
                success: false,
                message: 'OTP không hợp lệ hoặc đã hết hạn'
            });
            return;
        }

        await pool.query(
            `UPDATE users SET is_verified = true, otp = NULL, otp_expires_at = NULL WHERE email = $1`,
            [email]
        );

        res.status(200).json({
            success: true,
            message: 'Tài khoản đã được xác thực thành công'
        });
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
        });
    }
};

// Đăng nhập
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const user = result.rows[0];

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Email không tồn tại trong hệ thống'
            });
            return;
        }

        if (!user.is_verified) {
            res.status(401).json({
                success: false,
                message: 'Tài khoản chưa được xác thực, vui lòng kiểm tra email'
            });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({
                success: false,
                message: 'Mật khẩu không chính xác'
            });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({
                success: false,
                message: 'Cấu hình JWT không hợp lệ'
            });
            return;
        }

        const expiresIn: string = process.env.JWT_EXPIRES_IN || '1d';
        // @ts-ignore
        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            { expiresIn }
        );

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'Lỗi server, vui lòng thử lại sau'
        });
    }
};
