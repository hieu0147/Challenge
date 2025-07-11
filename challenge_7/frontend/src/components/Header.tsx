import React, { useState, useRef } from 'react';
import { Search, Menu, X, Sun, Moon, Newspaper, ChevronDown, Cpu, Briefcase, FlaskConical, HeartPulse, Dumbbell, Film, User, Heart } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
  categories: { id: string; name: string; slug: string }[];
  activeCategory: string;
  onLoginClick?: () => void;
  user: any;
  setUser: (user: any) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch, onCategoryChange, categories, activeCategory, onLoginClick, user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const theLoaiCategories = categories.filter((c) => (c as Category & { group?: string }).group === 'Thể loại') as (Category & { group?: string })[];
  const homeCategory = categories.find(c => c.slug === 'all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Map icon cho từng thể loại
  const categoryIcons: Record<string, JSX.Element> = {
    'cong-nghe': <Cpu className="w-4 h-4 mr-2 text-blue-500" />, // Công nghệ
    'kinh-doanh': <Briefcase className="w-4 h-4 mr-2 text-green-500" />, // Kinh doanh
    'khoa-hoc': <FlaskConical className="w-4 h-4 mr-2 text-purple-500" />, // Khoa học
    'suc-khoe': <HeartPulse className="w-4 h-4 mr-2 text-pink-500" />, // Sức khỏe
    'the-thao': <Dumbbell className="w-4 h-4 mr-2 text-yellow-500" />, // Thể thao
    'giai-tri': <Film className="w-4 h-4 mr-2 text-red-500" />, // Giải trí
  };

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
    onSearch(searchQuery);
  };

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    setIsMenuOpen(false);
  };

  const handleCategoryButtonClick = (category: string) => {
    handleCategoryClick(category);
    navigate('/');
  };

  // Thay đổi sự kiện mở/đóng dropdown từ hover sang click
  const handleDropdownToggle = () => setIsDropdownOpen((open) => !open);
  const handleDropdownClose = () => setIsDropdownOpen(false);

  // Đóng dropdown khi click ra ngoài
  React.useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      const dropdown = document.getElementById('theloai-dropdown');
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (setUser) setUser(null);
    setUserMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  // Đóng dropdown User khi click ra ngoài
  React.useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const userBtn = document.getElementById('user-btn');
      if (dropdown && !dropdown.contains(e.target as Node) && userBtn && !userBtn.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  // Lấy tất cả categories trừ 'all'
  const categoryList = categories.filter(c => c.slug !== 'all');

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Search */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleCategoryButtonClick('all')}>
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">News</h1>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {homeCategory && (
                <button
                  key={homeCategory.id}
                  onClick={() => handleCategoryButtonClick(homeCategory.slug)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === homeCategory.slug
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                >
                  {homeCategory.name}
                </button>
              )}
              <div
                className="relative"
              >
                <button
                  type="button"
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${theLoaiCategories.some(c => c.slug === activeCategory)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  onClick={handleDropdownToggle}
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                  aria-controls="theloai-dropdown"
                >
                  Thể loại
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div
                    id="theloai-dropdown"
                    className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 z-50 border border-gray-200 dark:border-gray-700 transition-all animate-fade-in"
                  >
                    {categoryList.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => { handleCategoryButtonClick(category.slug); handleDropdownClose(); }}
                        className={`flex items-center w-full text-left px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${activeCategory === category.slug
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        {categoryIcons[category.slug] || null}
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  debounceRef.current = setTimeout(() => {
                    onSearch(e.target.value);
                  }, 400);
                }}
                className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </form>


          {/* Search and Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Nếu chưa đăng nhập, hiển thị nút Đăng nhập */}
            {!user && (
              <button
                onClick={onLoginClick ? onLoginClick : () => navigate('/login')}
                className="hidden sm:inline-block px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Đăng nhập
              </button>
            )}
            {/* Nếu đã đăng nhập, hiển thị icon User */}
            {user && (
              <div className="relative">
                <button
                  id="user-btn"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
                  aria-label="Tài khoản"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-blue-700">
                      {user.name?.trim().charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </button>
                {userMenuOpen && (
                  <div id="user-dropdown" className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl py-2 z-50 border border-gray-200 dark:border-gray-700 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                    </div>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}
                    >
                      <User className="w-4 h-4 mr-2" /> Thông tin cá nhân
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      onClick={() => { setUserMenuOpen(false); navigate('/favorites'); }}
                    >
                      <Heart className="w-4 h-4 mr-2 text-pink-500" /> Tin tức yêu thích
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <div className="mt-4 sm:hidden">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bài viết..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (debounceRef.current) clearTimeout(debounceRef.current);
                        debounceRef.current = setTimeout(() => {
                          onSearch(e.target.value);
                        }, 400);
                      }}
                      className="pl-10 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                  </div>
                </form>
              </div>
              {homeCategory && (
                <button
                  key={homeCategory.id}
                  onClick={() => { handleCategoryButtonClick(homeCategory.slug); setIsMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === homeCategory.slug
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                >
                  {homeCategory.name}
                </button>
              )}
              <div>
                <button
                  type="button"
                  onClick={() => setIsMobileDropdownOpen(open => !open)}
                  className={`flex items-center w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${theLoaiCategories.some(c => c.slug === activeCategory)
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                >
                  Thể loại
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileDropdownOpen && (
                  <div className="pl-4 mt-1 space-y-1">
                    {theLoaiCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => { handleCategoryButtonClick(category.slug); setIsMenuOpen(false); setIsMobileDropdownOpen(false); }}
                        className={`flex items-center w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category.slug
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                          }`}
                      >
                        {categoryIcons[category.slug]}
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {/* Nếu chưa đăng nhập, hiển thị nút Đăng nhập */}
              {!user && (
                <button
                  onClick={onLoginClick ? onLoginClick : () => navigate('/login')}
                  className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Đăng nhập
                </button>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Thêm hiệu ứng fade-in cho dropdown */}
      <style>{`
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in {
        animation: fade-in 0.18s ease;
      }
      `}</style>
    </header>
  );
};