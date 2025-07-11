import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import ArticleGrid from './components/ArticleGrid';
import { SearchResults } from './components/SearchResults';
import { useArticles } from './hooks/useArticles';
import { Article, Category } from './types';
import { categories, articles as allArticles } from './data/mockData';
import { searchArticles, fetchCategories } from './services/api';
import ArticleDetail from './components/ArticleDetail';
import ScrollToTopButton from './components/ScrollToTopButton';
import Login from './components/Login';
import Register from './components/Register';
import OtpVerification from './components/OtpVerification';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserProfile from './components/UserProfile';
import Footer from './components/Footer';
import FavoriteArticles from './components/FavoriteArticles';
import AdminPage from './components/AdminPage';
import ArticleDetailPage from './components/ArticleDetailPage';

function HomePage({
  searchResults,
  searchQuery,
  isSearching,
  onClearSearch,
  onArticleClick,
  activeCategory
}: any) {
  return (
    <main>
      {isSearching ? (
        <SearchResults
          articles={searchResults}
          query={searchQuery}
          onArticleClick={onArticleClick}
          onClearSearch={onClearSearch}
        />
      ) : (
        <ArticleGrid category={activeCategory !== 'all' ? activeCategory : undefined} />
      )}
    </main>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const { articles, loading, hasMore, loadMore, error } = useArticles(activeCategory);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
    else setUser(null);
  }, []);

  useEffect(() => {
    const handleOpenOtp = () => setIsOtpOpen(true);
    window.addEventListener('openOtpVerification', handleOpenOtp);
    return () => window.removeEventListener('openOtpVerification', handleOpenOtp);
  }, []);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setSearchQuery(query);
    setIsSearching(true);
    try {
      const res = await searchArticles(query);
      setSearchResults(res.data || res);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleArticleClick = (article: Article) => {
    navigate(`/articles/${article.id}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {location.pathname !== '/admin' && (
        <Header
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          activeCategory={activeCategory}
          onLoginClick={() => setIsLoginOpen(true)}
          user={user}
          setUser={setUser}
        />
      )}
      <Routes>
        <Route path="/" element={
          <HomePage
            searchResults={searchResults}
            searchQuery={searchQuery}
            isSearching={isSearching}
            onClearSearch={handleClearSearch}
            onArticleClick={handleArticleClick}
            activeCategory={activeCategory}
          />
        } />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/profile" element={user ? <UserProfile userId={user.id} /> : <div className="text-center py-12">Bạn cần đăng nhập để xem thông tin cá nhân.</div>} />
        <Route path="/favorites" element={<FavoriteArticles />} />
        <Route path="/admin" element={user && user.role === 'admin' ? <AdminPage /> : <Navigate to="/" replace />} />
      </Routes>
      {location.pathname !== '/admin' && <Footer />}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onRegisterClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}
        setUser={setUser}
      />
      <Register
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onLoginClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
        onOpenOtp={() => setIsOtpOpen(true)}
      />
      <OtpVerification isOpen={isOtpOpen} onClose={() => setIsOtpOpen(false)} />
      <ScrollToTopButton />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover aria-label="Notification" />
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}