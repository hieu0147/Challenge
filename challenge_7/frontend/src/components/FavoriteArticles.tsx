import React from 'react';
import { ArticleCard } from './ArticleCard';
import { Article } from '../types';
import { useNavigate } from 'react-router-dom';

// Mock data mẫu
const favoriteArticles: Article[] = [
    {
        id: '1',
        title: 'AI thay đổi thế giới như thế nào?',
        excerpt: 'Trí tuệ nhân tạo đang tác động mạnh mẽ đến mọi lĩnh vực trong cuộc sống...',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        author: 'Nguyễn Văn A',
        readTime: 5,
        publishedAt: '2024-06-01',
        tags: ['Công nghệ', 'AI'],
        content: 'Nội dung chi tiết về AI...',
        category: 'Công nghệ',
    },
    {
        id: '2',
        title: 'Kinh tế toàn cầu năm 2024',
        excerpt: 'Dự báo kinh tế thế giới sẽ có nhiều biến động trong năm nay...',
        imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
        author: 'Trần Thị B',
        readTime: 7,
        publishedAt: '2024-05-28',
        tags: ['Kinh doanh'],
        content: 'Nội dung chi tiết về kinh tế toàn cầu...',
        category: 'Kinh doanh',
    },
    {
        id: '3',
        title: 'Khám phá vũ trụ: Những điều chưa biết',
        excerpt: 'Vũ trụ luôn ẩn chứa nhiều bí ẩn mà con người chưa khám phá hết...',
        imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80',
        author: 'Lê Văn C',
        readTime: 6,
        publishedAt: '2024-05-20',
        tags: ['Khoa học', 'Vũ trụ'],
        content: 'Nội dung chi tiết về vũ trụ...',
        category: 'Khoa học',
    },
];

// Custom ArticleCard: Bookmark màu blue
const CustomArticleCard = (props: any) => (
    <ArticleCard {...props} bookmarkColor="#2563eb" />
);

const FavoriteArticles: React.FC = () => {
    const navigate = useNavigate();
    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Tin tức yêu thích</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">Những bài viết bạn đã lưu lại</p>
                </div>
                {favoriteArticles.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Bạn chưa lưu bài viết nào.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {favoriteArticles.map(article => (
                            <CustomArticleCard key={article.id} article={article} onClick={() => navigate(`/article/${article.id}`)} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default FavoriteArticles; 