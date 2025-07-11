import { useState, useEffect } from 'react';
import { Article } from '../types';
import { fetchArticles } from '../data/mockData';

export const useArticles = (category: string = 'all') => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = async (reset: boolean = false) => {
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const currentPage = reset ? 1 : page;
      const { articles: newArticles, hasMore: moreAvailable } = await fetchArticles(currentPage, 6, category);

      if (reset) {
        setArticles(newArticles);
        setPage(2);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
        setPage(prev => prev + 1);
      }

      setHasMore(moreAvailable);
    } catch (err) {
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
    loadArticles(true);
  }, [category]);

  return { articles, loading, hasMore, loadMore: () => loadArticles(false), error };
};