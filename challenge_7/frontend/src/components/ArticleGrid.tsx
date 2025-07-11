import React, { useEffect, useState } from 'react';
import { ArticleCard } from './ArticleCard';
import { LoadingSpinner } from './LoadingSpinner';
import { Article } from '../types';
import { fetchArticles, fetchArticlesByCategory } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 12;
const MAX_PAGE_BUTTONS = 5;

const ArticleGrid: React.FC<{ category?: string }> = ({ category }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setPage(1);
  }, [category]);

  useEffect(() => {
    setLoading(true);
    const fetchFn = category
      ? () => fetchArticlesByCategory(category, page, PAGE_SIZE)
      : () => fetchArticles(page, PAGE_SIZE);
    fetchFn()
      .then((res) => {
        setArticles(res.data as Article[]);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [page, category]);

  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : 1;
  const pageButtons = [];
  const startPage = Math.max(1, Math.min(page - 2, totalPages - MAX_PAGE_BUTTONS + 1));
  const endPage = Math.min(totalPages, startPage + MAX_PAGE_BUTTONS - 1);
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(i);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Bài viết mới nhất</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Khám phá tin tức và góc nhìn mới nhất</p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">Không tìm thấy bài viết nào.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => navigate(`/articles/${article.id}`)}
                />
              ))}
            </div>

            {/* Pagination buttons */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className={`px-4 py-2 rounded border ${page === 1 ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed' : 'bg-white text-blue-600 border-blue-500'} transition`}
                >
                  {'<'}
                </button>
                {pageButtons.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded border ${p === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-600 border-blue-500'} transition`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
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
    </section>
  );
};

export default ArticleGrid;