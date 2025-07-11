// config/mailer.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTPEmail = async (email: string, otp: string) => {
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
        html: htmlContent,
    });
};
