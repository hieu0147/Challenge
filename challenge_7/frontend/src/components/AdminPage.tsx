import React from 'react';
import { LogOut, Moon, Sun, Search, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { fetchArticleStats, fetchUsers, fetchCategories, createArticle, updateArticle, deleteArticle, fetchArticlesByCategory, searchArticles, createUser, updateUser as updateUserApi, deleteUser as deleteUserApi } from '../services/api';
import { ArticleCard } from './ArticleCard';
import { LoadingSpinner } from './LoadingSpinner';
import { Article, Category, User } from '../types';
import { fetchArticles } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal';

const PAGE_SIZE = 12;

const AdminPage: React.FC = () => {
    const [totalArticles, setTotalArticles] = React.useState<number>(0);
    const [totalUsers, setTotalUsers] = React.useState<number>(0);
    const [tab, setTab] = React.useState<'dashboard' | 'articles' | 'users'>('dashboard');
    const [articles, setArticles] = React.useState<Article[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState<number>(0);
    const [showForm, setShowForm] = React.useState(false);
    const [formMode, setFormMode] = React.useState<'add' | 'edit'>('add');
    const [formData, setFormData] = React.useState<Partial<Article>>({});
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = React.useState<string>('');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [users, setUsers] = React.useState<User[]>([]);
    const [showUserForm, setShowUserForm] = React.useState(false);
    const [userFormMode, setUserFormMode] = React.useState<'add' | 'edit'>('add');
    const [userFormData, setUserFormData] = React.useState<Partial<User>>({});
    const [showDeleteUserModal, setShowDeleteUserModal] = React.useState(false);
    const [deleteUserId, setDeleteUserId] = React.useState<string | null>(null);
    const [userPasswordConfirm, setUserPasswordConfirm] = React.useState('');
    const [userPasswordError, setUserPasswordError] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
    const [userSearch, setUserSearch] = React.useState('');
    const [userRoleFilter, setUserRoleFilter] = React.useState('');
    let adminName = 'admin';
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user && user.name) adminName = user.name;
        }
    } catch { }
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const fetchStatsData = React.useCallback(() => {
        fetchArticleStats().then(stats => setTotalArticles(stats.total));
        fetchUsers().then(usersRes => setTotalUsers(usersRes.total));
    }, []);

    React.useEffect(() => {
        fetchStatsData();
    }, [fetchStatsData]);

    React.useEffect(() => {
        setSelectedCategory('');
        setSearchTerm('');
        setPage(1);
    }, [tab]);

    React.useEffect(() => {
        if (tab === 'articles') {
            setLoading(true);
            let fetchFn;
            if (searchTerm) {
                fetchFn = () => searchArticles(searchTerm, page, PAGE_SIZE);
            } else if (selectedCategory) {
                fetchFn = () => fetchArticlesByCategory(selectedCategory, page, PAGE_SIZE);
            } else {
                fetchFn = () => fetchArticles(page, PAGE_SIZE);
            }
            fetchFn()
                .then((res: any) => {
                    setArticles(res.data);
                    setTotal(res.total);
                })
                .finally(() => setLoading(false));
        }
    }, [tab, page, selectedCategory, searchTerm]);

    React.useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);

    React.useEffect(() => {
        if (tab === 'users') {
            fetchUsers().then(res => setUsers(res.data));
        }
    }, [tab]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const pageButtons = [];
    const MAX_PAGE_BUTTONS = 5;
    const startPage = Math.max(1, Math.min(page - 2, totalPages - MAX_PAGE_BUTTONS + 1));
    const endPage = Math.min(totalPages, startPage + MAX_PAGE_BUTTONS - 1);
    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(i);
    }

    const handleAdd = () => {
        setFormMode('add');
        setFormData({});
        setShowForm(true);
    };

    const handleEdit = (article: Article) => {
        setFormMode('edit');
        setFormData(article);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setLoading(true);
        try {
            await deleteArticle(deleteId);
            toast.success('Đã xóa bài viết thành công!');
            fetchStatsData();
        } catch (err) {
            toast.error('Xóa bài viết thất bại!');
        }
        setShowDeleteModal(false);
        setDeleteId(null);
        fetchArticles(page, PAGE_SIZE).then(res => {
            setArticles(res.data);
            setTotal(res.total);
        }).finally(() => setLoading(false));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (formMode === 'add') {
                await createArticle(formData);
                toast.success('Thêm bài viết thành công!');
            } else if (formMode === 'edit' && formData.id) {
                await updateArticle(formData.id, formData);
                toast.success('Cập nhật bài viết thành công!');
            }
            setShowForm(false);
            fetchStatsData();
        } catch (err) {
            toast.error('Lưu bài viết thất bại!');
        }
        fetchArticles(page, PAGE_SIZE).then(res => {
            setArticles(res.data);
            setTotal(res.total);
        }).finally(() => setLoading(false));
    };

    const handleAddUser = () => {
        setUserFormMode('add');
        setUserFormData({});
        setShowUserForm(true);
    };

    const handleEditUser = (user: User) => {
        setUserFormMode('edit');
        setUserFormData(user);
        setShowUserForm(true);
    };

    const handleDeleteUser = (id: string) => {
        setDeleteUserId(id);
        setShowDeleteUserModal(true);
    };

    const confirmDeleteUser = async () => {
        if (!deleteUserId) return;
        try {
            await deleteUserApi(deleteUserId);
            toast.success('Đã xóa người dùng thành công!');
            fetchStatsData();
        } catch {
            toast.error('Xóa người dùng thất bại!');
        }
        setShowDeleteUserModal(false);
        setDeleteUserId(null);
        fetchUsers().then(res => setUsers(res.data));
    };

    function validatePassword(password: string) {
        if (!password) return false;
        // Tối thiểu 8 ký tự, ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
    }

    const handleUserFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUserPasswordError('');
        if (userFormMode === 'add' || (userFormMode === 'edit' && userFormData.password)) {
            if (!validatePassword(userFormData.password || '')) {
                setUserPasswordError('Mật khẩu phải từ 8 ký tự, có chữ hoa, số và ký tự đặc biệt!');
                return;
            }
            if (userFormData.password !== userPasswordConfirm) {
                setUserPasswordError('Mật khẩu nhập lại không khớp!');
                return;
            }
        }
        try {
            if (userFormMode === 'add') {
                await createUser(userFormData);
                toast.success('Thêm người dùng thành công!');
            } else if (userFormMode === 'edit' && userFormData.id) {
                const dataToSend = { ...userFormData };
                if (!userFormData.password) {
                    delete dataToSend.password;
                }
                delete dataToSend.email;
                await updateUserApi(userFormData.id, dataToSend);
                toast.success('Cập nhật người dùng thành công!');
            }
            setShowUserForm(false);
            setUserPasswordConfirm('');
            fetchStatsData();
        } catch (err: any) {
            let msg = 'Lưu người dùng thất bại!';
            if (err?.response?.data?.message) msg += ' ' + err.response.data.message;
            else if (err?.message) msg += ' ' + err.message;
            toast.error(msg);
        }
        fetchUsers().then(res => setUsers(res.data));
    };

    const filteredUsers = users.filter(user => {
        const keyword = userSearch.toLowerCase();
        const matchName = user.name?.toLowerCase().includes(keyword);
        const matchEmail = user.email?.toLowerCase().includes(keyword);
        const matchRole = userRoleFilter ? user.role === userRoleFilter : true;
        return (matchName || matchEmail) && matchRole;
    });

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r min-h-screen flex flex-col">
                <div className="h-16 flex items-center justify-center border-b dark:border-gray-700">
                    <span className="text-2xl font-bold text-blue-600">{adminName}</span>
                </div>
                <nav className="flex-1 py-4">
                    <ul className="space-y-1">
                        <li>
                            <button onClick={() => setTab('dashboard')} className={`flex items-center w-full px-6 py-3 ${tab === 'dashboard' ? 'text-blue-600 bg-blue-50 dark:bg-gray-900' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} rounded-r-full font-medium`}>
                                <span className="mr-2">🏠</span> Dashboard
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setTab('articles')} className={`flex items-center w-full px-6 py-3 ${tab === 'articles' ? 'text-blue-600 bg-blue-50 dark:bg-gray-900' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} rounded-r-full`}>
                                <span className="mr-2">📰</span> Bài viết
                            </button>
                        </li>
                        <li>
                            <button onClick={() => setTab('users')} className={`flex items-center w-full px-6 py-3 ${tab === 'users' ? 'text-blue-600 bg-blue-50 dark:bg-gray-900' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'} rounded-r-full`}>
                                <span className="mr-2">👤</span> Người dùng
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-end px-8">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label="Đổi giao diện sáng/tối"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            className="text-red-600 dark:text-gray-300 hover:text-red-400 flex items-center space-x-1"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </header>
                {/* Main content by tab */}
                <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
                    {tab === 'dashboard' && (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard quản trị</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-start">
                                    <span className="text-gray-500 dark:text-gray-300 mb-2">Tổng số bài viết</span>
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{totalArticles}</span>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-start">
                                    <span className="text-gray-500 dark:text-gray-300 mb-2">Tổng số người dùng</span>
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">{totalUsers}</span>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center justify-center">
                                    <span className="text-5xl text-gray-300 dark:text-gray-600 mb-2">📊</span>
                                    <span className="text-gray-500 dark:text-gray-300 mt-2">Biểu đồ bài viết theo danh mục</span>
                                </div>
                            </div>
                        </>
                    )}
                    {tab === 'articles' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center justify-between">
                                Quản lý bài viết
                            </h2>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div className="flex gap-2 items-center">
                                    <label className="font-medium mr-2 dark:text-white">Thể loại:</label>
                                    <select className="p-2 rounded border" value={selectedCategory} onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}>
                                        <option value="">Tất cả</option>
                                        {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black dark:text-white" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm bài viết..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') setPage(1); }}
                                        className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 text-black border border-gray-400 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <button onClick={handleAdd} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">+ Thêm bài viết</button>
                            </div>
                            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={formMode === 'add' ? 'Thêm bài viết' : 'Sửa bài viết'}>
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div>
                                        <label className="block mb-1 font-medium">Tiêu đề</label>
                                        <input type="text" className="w-full p-2 rounded border" value={formData.title || ''} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} required />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Slug</label>
                                        <input type="text" className="w-full p-2 rounded border" value={formData.slug || ''} onChange={e => setFormData(f => ({ ...f, slug: e.target.value }))} required />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Nội dung</label>
                                        <textarea className="w-full p-2 rounded border min-h-[120px]" value={formData.content || ''} onChange={e => setFormData(f => ({ ...f, content: e.target.value }))} required />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Ảnh (URL)</label>
                                        <input type="text" className="w-full p-2 rounded border" value={formData.thumbnail || ''} onChange={e => setFormData(f => ({ ...f, thumbnail: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Danh mục</label>
                                        <select className="w-full p-2 rounded border" value={formData.category_id || ''} onChange={e => setFormData(f => ({ ...f, category_id: Number(e.target.value) }))} required>
                                            <option value="">-- Chọn danh mục --</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex gap-4 justify-end">
                                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Lưu</button>
                                        <button type="button" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowForm(false)}>Hủy</button>
                                    </div>
                                </form>
                            </Modal>
                            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Xác nhận xóa bài viết">
                                <div className="mb-4">Bạn có chắc muốn xóa bài viết này không?</div>
                                <div className="flex gap-4 justify-end">
                                    <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Xóa</button>
                                    <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
                                </div>
                            </Modal>
                            {loading ? <LoadingSpinner /> : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {articles.map(article => (
                                            <div key={article.id} className="relative group">
                                                <ArticleCard article={article} />
                                                <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                    <button onClick={e => { e.stopPropagation(); handleEdit(article); }} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-md">Sửa</button>
                                                    <button onClick={e => { e.stopPropagation(); handleDelete(article.id); }} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-md">Xóa</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-8 space-x-2">
                                            <button
                                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                                disabled={page === 1}
                                                className={`px-4 py-2 rounded border ${page === 1 ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-500'} transition`}
                                            >
                                                {'<'}
                                            </button>
                                            {pageButtons.map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => setPage(p)}
                                                    className={`px-4 py-2 rounded border ${p === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-600 border-blue-500'} transition`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={page === totalPages}
                                                className={`px-4 py-2 rounded border ${page === totalPages ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-500'} transition`}
                                            >
                                                {'>'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                    {tab === 'users' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center justify-between">Quản lý người dùng</h2>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div>
                                    <select className="p-2 rounded border" value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
                                        <option value="">Tất cả vai trò</option>
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm tên hoặc email..."
                                        value={userSearch}
                                        onChange={e => setUserSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 text-black border border-gray-400 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                                    />
                                </div>
                                <button onClick={handleAddUser} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">+ Thêm người dùng</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow dark:text-white">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2">Tên</th>
                                            <th className="px-4 py-2">Email</th>
                                            <th className="px-4 py-2">Role</th>
                                            <th className="px-4 py-2">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user.id} className="border-b dark:border-gray-700 ">
                                                <td className="px-4 py-2">{user.name}</td>
                                                <td className="px-4 py-2">{user.email}</td>
                                                <td className="px-4 py-2">{user.role}</td>
                                                <td className="px-4 py-2">
                                                    <button onClick={() => handleEditUser(user)} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-md mr-2">Sửa</button>
                                                    <button onClick={() => handleDeleteUser(user.id!)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-md">Xóa</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Modal isOpen={showUserForm} onClose={() => { setShowUserForm(false); setUserPasswordConfirm(''); setUserPasswordError(''); }} title={userFormMode === 'add' ? 'Thêm người dùng' : 'Sửa người dùng'}>
                                <form onSubmit={handleUserFormSubmit} className="space-y-4">
                                    <div>
                                        <label className="block mb-1 font-medium">Tên</label>
                                        <input type="text" className="w-full p-2 rounded border" value={userFormData.name || ''} onChange={e => setUserFormData(f => ({ ...f, name: e.target.value }))} required />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Email</label>
                                        <input
                                            type="email"
                                            className="w-full p-2 rounded border"
                                            value={userFormData.email || ''}
                                            onChange={e => setUserFormData(f => ({ ...f, email: e.target.value }))}
                                            required
                                            disabled={userFormMode === 'edit'}
                                        />
                                    </div>
                                    {(userFormMode === 'add') && (
                                        <>
                                            <div>
                                                <label className="block mb-1 font-medium">Mật khẩu</label>
                                                <div className="relative">
                                                    <input type={showPassword ? 'text' : 'password'} className="w-full p-2 rounded border pr-10" value={userFormData.password || ''} onChange={e => setUserFormData(f => ({ ...f, password: e.target.value }))} required={userFormMode === 'add'} />
                                                    <button type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                                                        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">Tối thiểu 8 ký tự, 1 chữ hoa, 1 số, 1 ký tự đặc biệt</div>
                                            </div>
                                            <div>
                                                <label className="block mb-1 font-medium">Nhập lại mật khẩu</label>
                                                <div className="relative">
                                                    <input type={showPasswordConfirm ? 'text' : 'password'} className="w-full p-2 rounded border pr-10" value={userPasswordConfirm} onChange={e => setUserPasswordConfirm(e.target.value)} required={userFormMode === 'add' || !!userFormData.password} />
                                                    <button type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" onClick={() => setShowPasswordConfirm(v => !v)} tabIndex={-1}>
                                                        {showPasswordConfirm ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {userPasswordError && <div className="text-red-500 text-sm mt-1">{userPasswordError}</div>}
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className="block mb-1 font-medium">Số điện thoại</label>
                                        <input type="text" className="w-full p-2 rounded border" value={userFormData.phone || ''} onChange={e => setUserFormData(f => ({ ...f, phone: e.target.value }))} />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-medium">Role</label>
                                        <select className="w-full p-2 rounded border" value={userFormData.role || 'user'} onChange={e => setUserFormData(f => ({ ...f, role: e.target.value }))}>
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-4 justify-end">
                                        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Lưu</button>
                                        <button type="button" className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => { setShowUserForm(false); setUserPasswordConfirm(''); setUserPasswordError(''); }}>Hủy</button>
                                    </div>
                                </form>
                            </Modal>
                            <Modal isOpen={showDeleteUserModal} onClose={() => setShowDeleteUserModal(false)} title="Xác nhận xóa người dùng">
                                <div className="mb-4">Bạn có chắc muốn xóa người dùng này không?</div>
                                <div className="flex gap-4 justify-end">
                                    <button onClick={confirmDeleteUser} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Xóa</button>
                                    <button onClick={() => setShowDeleteUserModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
                                </div>
                            </Modal>
                        </div>
                    )}
                </main>
            </div>
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover aria-label="Thông báo hệ thống" />
        </div>
    );
};

export default AdminPage; 