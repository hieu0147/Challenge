// services/auth.service.ts
import bcrypt from 'bcrypt';
import pool from '../db';
import { generateOTP } from '../utils/otp';
import { signToken } from '../utils/jwt';

export const register = async (email: string, password: string) => {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) throw new Error('Email đã tồn tại');

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    await pool.query(
        `INSERT INTO users (email, password, otp, otp_expires_at) VALUES ($1, $2, $3, $4)`,
        [email, hashed, otp, otpExpires]
    );

    // Gửi OTP qua email (bạn có thể dùng hàm gửi mail ở controller hoặc tách riêng)
    // await sendOTP(email, otp);

    return { message: 'OTP đã được gửi qua email' };
};

export const verifyOTP = async (email: string, otp: string) => {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    if (!user) throw new Error('Không tìm thấy người dùng');
    if (user.is_verified) throw new Error('Tài khoản đã xác thực');
    if (user.otp !== otp || new Date() > user.otp_expires_at)
        throw new Error('OTP không hợp lệ hoặc đã hết hạn');

    await pool.query(
        'UPDATE users SET is_verified = true, otp = NULL, otp_expires_at = NULL WHERE email = $1',
        [email]
    );

    return { message: 'Xác thực thành công' };
};

export const login = async (email: string, password: string) => {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];
    if (!user) throw new Error('Email không tồn tại');
    if (!user.is_verified) throw new Error('Tài khoản chưa được xác thực');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Mật khẩu không đúng');

    const token = signToken({ id: user.id, email: user.email });
    return { token };
};
