import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface UserProfileProps {
    userId?: string;
    userEmail?: string;
}

interface UserData {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role?: string;
    status?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, userEmail }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editAvatar, setEditAvatar] = useState<string | undefined>(undefined);
    const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMsg, setUpdateMsg] = useState('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const fetchUser = async () => {
        setLoading(true);
        setError('');
        try {
            let query = '';
            if (userId) query = `id=${userId}`;
            else if (userEmail) query = `email=${userEmail}`;
            else throw new Error('Thiếu thông tin user');
            const res = await fetch(`http://localhost:5000/api/auth/user?${query}`);
            if (!res.ok) throw new Error((await res.json()).message || 'Lỗi khi lấy thông tin user');
            const data = await res.json();
            setUser(data);
            setEditName(data.name || '');
            setEditPhone(data.phone || '');
            setEditAvatar(data.avatar || undefined);
            setPreviewAvatar(data.avatar || undefined);
        } catch (err: any) {
            setError(err.message || 'Lỗi không xác định');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [userId, userEmail]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewAvatar(reader.result as string);
                setEditAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsUpdating(true);
        setUpdateMsg('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId || user?.id, name: editName, phone: editPhone, avatar: editAvatar })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Cập nhật thất bại');
            toast.success('Cập nhật thành công!');
            await fetchUser();
        } catch (err: any) {
            toast.error(err.message || 'Cập nhật thất bại');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center py-10 px-2 bg-white dark:bg-gray-900">
            <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900 dark:text-white">Thông tin cá nhân</h2>
                {loading ? (
                    <div className="text-center text-gray-500 dark:text-gray-300 py-8">Đang tải...</div>
                ) : error ? (
                    <div className="text-center text-red-500 py-8">{error}</div>
                ) : user && (
                    <form onSubmit={handleUpdate} className="flex flex-col items-center w-full">
                        <div className="flex flex-col sm:flex-row w-full items-center justify-center gap-6 sm:gap-10 mb-6 sm:mb-8">
                            {/* Avatar bên trái */}
                            <div className="flex flex-col items-center mb-4 sm:mb-0">
                                <div
                                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-blue-200 flex items-center justify-center text-5xl sm:text-6xl font-bold text-blue-700 mb-2 border overflow-hidden cursor-pointer hover:opacity-80 transition"
                                    onClick={handleAvatarClick}
                                    title="Chọn ảnh đại diện"
                                >
                                    {previewAvatar ? (
                                        <img src={previewAvatar} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase()

                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                />
                            </div>
                            {/* Form bên phải */}
                            <div className="flex-1 flex flex-col gap-4 w-full">
                                <div className="flex flex-row items-center mb-2 w-full">
                                    <label className="w-24 text-lg font-medium text-gray-900 dark:text-white" htmlFor="name">Tên:</label>
                                    <input
                                        id="name"
                                        type="text"
                                        className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex flex-row items-center mb-2 w-full">
                                    <label className="w-24 text-lg font-medium text-gray-900 dark:text-white" htmlFor="email">Email:</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="flex-1 px-3 py-2 rounded border border-gray-300 bg-gray-100 text-gray-500 w-full"
                                        value={user.email}
                                        readOnly
                                    />
                                </div>
                                <div className="flex flex-row items-center mb-2 w-full">
                                    <label className="w-24 text-lg font-medium text-gray-900 dark:text-white" htmlFor="phone">Phone:</label>
                                    <input
                                        id="phone"
                                        type="text"
                                        className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                        value={editPhone}
                                        onChange={e => setEditPhone(e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="mt-2 sm:mt-4 px-8 py-2 rounded-full text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UserProfile; 