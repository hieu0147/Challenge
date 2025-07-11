import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Newspaper, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { apiService, ResetPasswordData } from '../services/api';
import { toast } from 'react-toastify';

const NEWS_IMAGE =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

const ResetPassword: React.FC = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Lấy email từ localStorage (được lưu khi quên mật khẩu)
        const resetEmail = localStorage.getItem('resetEmail');
        if (resetEmail) {
            setEmail(resetEmail);
        } else {
            // Nếu không có email, redirect về trang chủ
            navigate('/');
        }
    }, [navigate]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const validatePassword = (pw: string) => {
        if (pw.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
        if (!/[A-Z]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 chữ hoa';
        if (!/[0-9]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 số';
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Vui lòng nhập đầy đủ 6 chữ số OTP');
            toast.error('Vui lòng nhập đầy đủ 6 chữ số OTP');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        const pwError = validatePassword(newPassword);
        if (pwError) {
            setError(pwError);
            toast.error(pwError);
            return;
        }

        setIsLoading(true);

        try {
            const resetData: ResetPasswordData = {
                email,
                code: otpCode,
                newPassword
            };

            const response = await apiService.resetPassword(resetData);

            toast.success(response.message);
            localStorage.removeItem('resetEmail');
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đặt lại mật khẩu');
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đặt lại mật khẩu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-700">
                        <img
                            src={NEWS_IMAGE}
                            alt="Background"
                            className="absolute inset-0 w-full h-full object-cover opacity-20"
                        />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
                            <div className="flex items-center mb-2">
                                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg">
                                    <Newspaper className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="ml-2 text-xl font-bold text-white">News</span>
                            </div>
                            <p className="text-white text-sm text-center">Đặt lại mật khẩu</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <div className="flex items-center mb-6">
                            <button
                                onClick={() => navigate('/')}
                                className="mr-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Quay lại"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Đặt lại mật khẩu</h2>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
                            Nhập mã OTP và mật khẩu mới cho <strong>{email}</strong>
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* OTP Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Mã OTP
                                </label>
                                <div className="flex justify-center space-x-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="w-full px-4 py-2 pl-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập mật khẩu mới"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="w-full px-4 py-2 pl-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập lại mật khẩu mới"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.join('').length !== 6 || !newPassword || !confirmPassword}
                                className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang đặt lại mật khẩu...
                                    </>
                                ) : (
                                    'Đặt lại mật khẩu'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                                <strong>Lưu ý:</strong> Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword; 