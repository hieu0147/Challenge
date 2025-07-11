import React, { useState, useEffect } from 'react';
import { Mail, Newspaper, X, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { apiService, ForgotPasswordData, ResetPasswordData } from '../services/api';
import { toast } from 'react-toastify';

const NEWS_IMAGE =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';



interface ForgotPasswordProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToLogin?: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ isOpen, onClose, onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [expire, setExpire] = useState(300); // 5 phút

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isSubmitted && expire > 0) {
            timer = setInterval(() => {
                setExpire(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isSubmitted, expire]);

    if (!isOpen) return null;

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const forgotPasswordData: ForgotPasswordData = {
                email
            };

            const response = await apiService.forgotPassword(forgotPasswordData);

            setIsSubmitted(true);
            setExpire(300); // Reset timer
            // Lưu email để sử dụng trong reset password
            localStorage.setItem('resetEmail', email);
            toast.success(response.message);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi email');
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        if (onBackToLogin) {
            onBackToLogin();
        } else {
            onClose();
        }
    };

    const handleResendEmail = async () => {
        if (isLoading) return;
        setError('');
        setIsLoading(true);
        try {
            const forgotPasswordData: ForgotPasswordData = { email };
            await apiService.forgotPassword(forgotPasswordData);
            setExpire(300); // Reset timer
            setOtp(['', '', '', '', '', '']);
            toast.success("Mã OTP mới đã được gửi.");
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi lại email');
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi lại email');
        } finally {
            setIsLoading(false);
        }
    };

    const validatePassword = (pw: string) => {
        if (pw.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
        if (!/[A-Z]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 chữ hoa';
        if (!/[0-9]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 số';
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
        return '';
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newArr = [...otp];
        newArr[index] = value.replace(/[^0-9]/g, '');
        setOtp(newArr);
        if (value && index < 5) {
            const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`forgot-otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp.join('').length !== 6) {
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
        setIsResetting(true);
        try {
            const resetData: ResetPasswordData = {
                email,
                code: otp.join(''),
                newPassword
            };
            const response = await apiService.resetPassword(resetData);
            toast.success(response.message);
            setIsSubmitted(false);
            setOtp(['', '', '', '', '', '']);
            setNewPassword('');
            setConfirmPassword('');
            setEmail('');
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đặt lại mật khẩu');
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đặt lại mật khẩu');
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="relative flex w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 m-4">
                {/* Nút X để đóng modal */}
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl focus:outline-none z-20"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Image + Logo + Slogan (ẩn trên mobile) */}
                <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gray-100 dark:bg-gray-900 relative">
                    <img
                        src={NEWS_IMAGE}
                        alt="News background"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="relative z-10 flex flex-col items-center px-6 py-8">
                        <div className="flex items-center mb-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
                                <Newspaper className="w-6 h-6 text-white" />
                            </div>
                            <span className="ml-2 text-2xl font-bold text-white drop-shadow">News</span>
                        </div>
                        <p className="text-white text-lg font-medium drop-shadow text-center">Cập nhật những tin tức mới nhất, nhanh nhất.</p>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-40" />
                </div>

                {/* Right: Forgot Password Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-800 relative z-10">
                    <div className="w-full max-w-md">
                        {!isSubmitted ? (
                            <>
                                <div className="flex items-center mb-6">
                                    <button
                                        type="button"
                                        onClick={handleBackToLogin}
                                        className="mr-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        aria-label="Quay lại đăng nhập"
                                        disabled={isLoading}
                                    >
                                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    </button>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quên mật khẩu</h2>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
                                    Nhập email của bạn để nhận mã OTP đặt lại mật khẩu
                                </p>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-6">
                                        <div className="relative">
                                            <input
                                                id="email"
                                                type="email"
                                                className="w-full px-4 py-2 pl-12 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nhập email của bạn"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                                disabled={isLoading}
                                            />
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            'Gửi mã OTP'
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <button
                                        type="button"
                                        onClick={handleBackToLogin}
                                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                        disabled={isLoading}
                                    >
                                        Quay lại đăng nhập
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Quên mật khẩu</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">
                                    Chúng tôi đã gửi mã OTP đến
                                </p>
                                <div className="mb-2 text-center">
                                    <span className="font-bold text-blue-700 text-base md:text-lg select-all">{email}</span>
                                </div>
                                {/* Đồng hồ đếm ngược */}
                                <div className="mb-4 text-center">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${expire > 30 ? 'bg-green-100 text-green-700' : expire > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}
                                        style={{ minWidth: 90, textAlign: 'center' }}>
                                        {expire > 0 ? `Mã OTP hết hạn sau: ${formatTime(expire)}` : 'Mã OTP đã hết hạn'}
                                    </span>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                                        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                    </div>
                                )}
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                                        Nhập mã OTP 6 chữ số
                                    </label>
                                    <div className="flex justify-center gap-3 mb-2">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`forgot-otp-${index}`}
                                                type="text"
                                                maxLength={1}
                                                value={digit}
                                                onChange={e => handleOtpChange(index, e.target.value)}
                                                onKeyDown={e => handleOtpKeyDown(index, e)}
                                                className="w-10 h-10 md:w-12 md:h-12 text-center text-base md:text-lg font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                                                disabled={isResetting || expire === 0}
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>
                                    <div className="mb-6 relative">
                                        <input
                                            id="newPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                            placeholder="Mật khẩu mới"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            required
                                            disabled={isResetting || expire === 0}
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                            onClick={() => setShowPassword(v => !v)}
                                            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                            disabled={isResetting || expire === 0}
                                        >
                                            {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>

                                    </div>

                                    <div className="mb-6 relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                            placeholder="Xác nhận mật khẩu mới"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            required
                                            disabled={isResetting || expire === 0}
                                        />
                                        <button
                                            type="button"
                                            tabIndex={-1}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                            onClick={() => setShowConfirmPassword(v => !v)}
                                            aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                            disabled={isResetting || expire === 0}
                                        >
                                            {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>

                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isResetting || otp.join('').length !== 6 || expire === 0}
                                        className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isResetting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Đang đặt lại mật khẩu...
                                            </>
                                        ) : (
                                            'Đặt lại mật khẩu'
                                        )}
                                    </button>
                                </form>
                                <div className="mt-6 text-center text-sm">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Không nhận được mã?{' '}
                                        <button
                                            type="button"
                                            onClick={handleResendEmail}
                                            disabled={isLoading}
                                            className="font-semibold text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed disabled:no-underline"
                                        >
                                            Gửi lại mã
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 