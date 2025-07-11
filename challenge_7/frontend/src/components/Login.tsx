import React, { useState } from 'react';
import { Eye, EyeOff, Newspaper, X } from 'lucide-react';
import ForgotPassword from './ForgotPassword';
import { apiService, LoginData } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const NEWS_IMAGE =
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

interface LoginProps {
    isOpen: boolean;
    onClose: () => void;
    onRegisterClick?: () => void;
    setUser: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose, onRegisterClick, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const loginData: LoginData = {
                email,
                password
            };

            const response = await apiService.login(loginData);

            // Lưu token và thông tin user vào localStorage
            if (response.token && response.user) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                if (setUser) setUser(response.user);
                toast.success('Đăng nhập thành công!');
                onClose();
                if (response.user.role === 'admin') {
                    navigate('/admin');
                    return;
                }
                // Có thể reload trang hoặc redirect
                // window.location.reload();
            }
        } catch (err) {
            const errMsg = err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng nhập';
            setError(errMsg);
            toast.error(errMsg);
            if (errMsg === 'Tài khoản chưa được xác thực') {
                localStorage.setItem('pendingEmail', email);
                onClose();
                // Giả sử có hàm mở OtpVerification ở App, có thể gọi props.onOpenOtp?.();
                if (typeof window !== 'undefined' && window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('openOtpVerification'));
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true);
    };

    const handleForgotPasswordClose = () => {
        setShowForgotPassword(false);
    };

    const handleBackToLogin = () => {
        setShowForgotPassword(false);
    };

    return (
        <>
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
                    {/* Right: Login Form */}
                    <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-gray-800 relative z-10">
                        <form
                            onSubmit={handleSubmit}
                            className="w-full max-w-md"
                        >
                            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Đăng nhập</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                                Nếu bạn chưa có tài khoản?{' '}
                                <button type="button" className="text-blue-600 dark:text-blue-400 hover:underline font-medium" onClick={onRegisterClick}>Đăng ký ngay</button>
                            </p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
                                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <div className="mb-4">
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="mb-2 relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                                    placeholder="Nhập mật khẩu"
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
                            <div className="mb-6 flex justify-end">
                                <button
                                    type="button"
                                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                                    tabIndex={0}
                                    onClick={handleForgotPasswordClick}
                                    disabled={isLoading}
                                >
                                    Quên mật khẩu?
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
                                        Đang đăng nhập...
                                    </>
                                ) : (
                                    'Đăng nhập'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            <ForgotPassword
                isOpen={showForgotPassword}
                onClose={handleForgotPasswordClose}
                onBackToLogin={handleBackToLogin}
            />
        </>
    );
};

export default Login; 