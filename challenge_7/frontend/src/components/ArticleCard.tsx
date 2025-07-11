import React, { useState } from 'react';
import { Clock, User, Calendar, Bookmark } from 'lucide-react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  onClick?: (article: Article) => void;
}

export const ArticleCard: React.FC<ArticleCardProps & { bookmarkColor?: string }> = ({ article, onClick, bookmarkColor }) => {
  const [liked, setLiked] = useState(false);

  return (
    <article
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => onClick?.(article)}
    >
      <div className="relative overflow-hidden">
        {article.thumbnail && (
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          className={`absolute top-3 right-3 transition-transform focus:outline-none
            rounded-full w-10 h-10 flex items-center justify-center
            ${bookmarkColor ? '' : liked ? 'bg-blue-500' : 'bg-white border border-gray-200'}
          `}
          style={bookmarkColor ? { backgroundColor: bookmarkColor } : {}}
        >
          {bookmarkColor ? (
            <Bookmark className="w-6 h-6" color="#fff" fill="#fff" />
          ) : (
            <Bookmark className="w-6 h-6" color={liked ? '#fff' : '#374151'} fill={liked ? '#fff' : 'none'} />
          )}
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {(article.title || '').slice(0, 100)}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span className="truncate">{article.author_id || 'Ẩn danh'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{article.views ?? 0} lượt xem</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{article.published_at ? new Date(article.published_at).toLocaleDateString() : ''}</span>
          </div>
        </div>
      </div>
    </article>
  );
};