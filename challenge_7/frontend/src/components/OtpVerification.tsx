import React, { useState, useEffect, useRef } from 'react';
import { Newspaper, X } from 'lucide-react';
import { apiService, VerifyOtpData } from '../services/api';
import { toast } from 'react-toastify';

const NEWS_IMAGE =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

interface OtpVerificationProps {
    isOpen: boolean;
    onClose: () => void;
}

const OTP_EXPIRE_SECONDS = 5 * 60; // 5 phút

const OtpVerification: React.FC<OtpVerificationProps> = ({ isOpen, onClose }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [expire, setExpire] = useState(OTP_EXPIRE_SECONDS);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        const pendingEmail = localStorage.getItem('pendingEmail');
        if (pendingEmail) {
            setEmail(pendingEmail);
        } else {
            onClose();
        }
        setExpire(OTP_EXPIRE_SECONDS);
        setOtp(['', '', '', '', '', '']);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        if (expire <= 0) return;
        timerRef.current = setTimeout(() => setExpire(expire - 1), 1000);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [expire, isOpen]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    if (!isOpen) return null;

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value.replace(/[^0-9]/g, '');
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Vui lòng nhập đầy đủ 6 chữ số');
            toast.error('Vui lòng nhập đầy đủ 6 chữ số');
            return;
        }
        if (expire <= 0) {
            setError('Mã OTP đã hết hạn. Vui lòng gửi lại mã OTP mới.');
            toast.error('Mã OTP đã hết hạn. Vui lòng gửi lại mã OTP mới.');
            return;
        }
        setIsLoading(true);
        try {
            const verifyData: VerifyOtpData = {
                email,
                code: otpCode
            };
            const response = await apiService.verifyOtp(verifyData);
            toast.success(response.message);
            localStorage.removeItem('pendingEmail');
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xác thực OTP');
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi xác thực OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setIsLoading(true);
        try {
            await apiService.resendRegisterOtp({ email });
            toast.success('Đã gửi lại mã OTP');
            setOtp(['', '', '', '', '', '']);
            setExpire(OTP_EXPIRE_SECONDS);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi lại OTP');
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi lại OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 transition-all duration-200">
            <div className="relative flex w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-gray-800 m-4 animate-fadeIn">
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
                <div className="hidden md:flex flex-col justify-center items-center w-1/3 bg-gray-100 dark:bg-gray-900 relative">
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
                        <p className="text-white text-lg font-medium drop-shadow text-center">Xác thực tài khoản</p>
                    </div>
                    <div className="absolute inset-0 bg-black opacity-40" />
                </div>
                {/* Right: OTP Form */}
                <div className="w-full md:w-2/3 flex items-center justify-center p-8 bg-white dark:bg-gray-800 relative z-10">
                    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto flex flex-col items-center">
                        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Xác thực OTP</h2>
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
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg w-full">
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        )}
                        <div className="mb-6 w-full flex flex-col items-center">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                                Nhập mã OTP 6 chữ số
                            </label>
                            <div className="flex justify-center items-center gap-4 md:gap-5">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-10 h-10 md:w-12 md:h-12 text-center text-base md:text-lg font-bold border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150"
                                        disabled={isLoading || expire <= 0}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || otp.join('').length !== 6 || expire <= 0}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold text-lg shadow-lg hover:from-blue-600 hover:to-blue-800 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang xác thực...
                                </>
                            ) : (
                                'Xác thực'
                            )}
                        </button>
                        <div className="text-center w-full">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isLoading}
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold disabled:opacity-50 transition-colors hover:text-blue-800"
                            >
                                Gửi lại mã OTP
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification; 