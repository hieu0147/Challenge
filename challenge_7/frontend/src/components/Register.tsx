import React, { useState } from 'react';
import { Eye, EyeOff, Newspaper, X } from 'lucide-react';
import { apiService, RegisterData } from '../services/api';
import { toast } from 'react-toastify';

const NEWS_IMAGE =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

interface RegisterProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick?: () => void;
    onOpenOtp?: () => void;
}

const Register: React.FC<RegisterProps> = ({ isOpen, onClose, onLoginClick, onOpenOtp }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const validatePassword = (pw: string) => {
        if (pw.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
        if (!/[A-Z]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 chữ hoa';
        if (!/[0-9]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 số';
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt';
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }

        const pwError = validatePassword(password);
        if (pwError) {
            setPasswordError(pwError);
            toast.error(pwError);
            return;
        }

        setIsLoading(true);

        try {
            const registerData: RegisterData = {
                email,
                password,
                name
            };

            const response = await apiService.register(registerData);

            // Lưu email để sử dụng trong OTP verification
            localStorage.setItem('pendingEmail', email);

            toast.success(response.message);
            onClose();
            if (onOpenOtp) onOpenOtp();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký');
            toast.error(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký');
        } finally {
            setIsLoading(false);
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
                {/* Right: Register Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-800 relative z-10">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Đăng ký</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                            Đã có tài khoản?{' '}
                            <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline font-medium" onClick={onLoginClick}>Đăng nhập</button>
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="mb-4">
                            <input
                                id="name"
                                type="text"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Họ tên"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="mb-4 relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="Mật khẩu"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                tabIndex={-1}
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                disabled={isLoading}
                            >
                                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                        </div>
                        {passwordError && <div className="text-red-500 text-sm mb-2 text-center">{passwordError}</div>}
                        <div className="mb-6 relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 focus:outline-none"
                                tabIndex={-1}
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang đăng ký...
                                </>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register; 