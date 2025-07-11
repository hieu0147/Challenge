import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArticleById } from '../services/api';
import ArticleDetail from './ArticleDetail';
import { Article } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

const ArticleDetailPage: React.FC = () => {
    const { id } = useParams();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchArticleById(id)
                .then(data => setArticle(data))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <LoadingSpinner />;
    if (!article) return <div className="text-center py-12">Không tìm thấy bài viết.</div>;

    return <ArticleDetail article={article} />;
};

export default ArticleDetailPage; 