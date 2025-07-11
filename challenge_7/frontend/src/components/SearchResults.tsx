import React from 'react';
import { ArticleCard } from './ArticleCard';
import { Article } from '../types';

interface SearchResultsProps {
  articles: Article[];
  query: string;
  onArticleClick: (article: Article) => void;
  onClearSearch: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  articles,
  query,
  onArticleClick,
  onClearSearch
}) => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Kết quả tìm kiếm cho "{query}"
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Tìm thấy {articles.length} bài viết
              </p>
            </div>
            <button
              onClick={onClearSearch}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Xóa tìm kiếm
            </button>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Không tìm thấy bài viết phù hợp với tìm kiếm của bạn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={onArticleClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};