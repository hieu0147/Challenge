const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const pool = require('../db'); // Kết nối pg-pool
require('dotenv').config();

// Gửi OTP qua email
const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
            <div style="max-width: 500px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center; color: #333;">OTP Verification</h2>
                <p style="font-size: 16px; color: #555;">Hello,</p>
                <p style="font-size: 16px; color: #555;">Your OTP code is:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <span style="font-size: 32px; color: #007BFF; font-weight: bold;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #888;">This OTP is valid for the next 5 minutes. Do not share it with anyone.</p>
                <p style="font-size: 14px; color: #888;">If you did not request this, please ignore this email.</p>
                <hr style="margin: 20px 0;" />
                <p style="font-size: 12px; color: #ccc; text-align: center;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
        </div>
    `;

    await transporter.sendMail({
        from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        html: htmlContent
    });
};

exports.register = async (req, res) => {
    const { email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const result = await pool.query(
        'INSERT INTO users (email, password, otp, otp_expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL \'10 minutes\') RETURNING *',
        [email, hashed, otp]
    );

    await sendOTP(email, otp);

    res.json({ message: 'OTP sent to email' });
};

exports.verifyOTP = async (req, res) => {
    try {
        // Kiểm tra xem req.body có tồn tại không
        if (!req.body) {
            return res.status(400).json({ message: 'Missing request body' });
        }

        // console.log("req.body = ", req.body);  // Debug

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND otp = $2 AND otp_expires_at > NOW()',
            [email, otp]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        await pool.query(
            'UPDATE users SET is_verified = true, otp = NULL, otp_expires_at = NULL WHERE email = $1',
            [email]
        );

        res.json({ message: 'Account verified successfully' });
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Tìm người dùng theo email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // Kiểm tra tồn tại, xác thực, và mật khẩu
        if (!user || !user.is_verified) {
            return res.status(401).json({ message: 'Email not verified or does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Tạo token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        // Trả về token
        res.status(200).json({
            message: 'Login successful',
            token
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
