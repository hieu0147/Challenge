import React, { useState } from 'react';
import { Article } from '../types';
import { Calendar, User, Clock, Tag, MessageCircle, Star, UserCircle, CornerDownRight, ChevronDown, ChevronUp, LogIn } from 'lucide-react';

interface ArticleDetailProps {
    article: Article;
}

const extractOriginalLink = (content: string): string | null => {
    const match = content.match(/href=\"([^\"]+)\"/);
    return match ? match[1] : null;
};

const stripFirstAnchor = (content: string): string => {
    return content.replace(/^<a [^>]+>.*?<\/a>/, '');
};

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article }) => {
    const [comments, setComments] = useState([
        { name: 'Người dùng 1', text: 'Bài viết rất hay và hữu ích!' },
        { name: 'Người dùng 2', text: 'Cảm ơn tác giả đã chia sẻ thông tin.' }
    ]);
    const [commentName, setCommentName] = useState('');
    const [commentText, setCommentText] = useState('');
    const [replies, setReplies] = useState([
        { parent: 0, name: 'kchi', text: 'hình như do bật chế độ tiết kiệm pin á bro', time: '6 phút trước' }
    ]);
    const [showReplies, setShowReplies] = useState<{ [key: number]: boolean }>({ 0: true });

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentName.trim() && commentText.trim()) {
            setComments([...comments, { name: commentName, text: commentText }]);
            setCommentName('');
            setCommentText('');
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const originalLink = extractOriginalLink(article.content);
    const contentWithoutFirstAnchor = stripFirstAnchor(article.content);

    return (
        <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
            <div className="max-w-3xl mx-auto py-12 px-4">
                {article.thumbnail && (
                    <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-64 object-cover rounded-xl mb-6"
                    />
                )}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    {article.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Tác giả: {article.author_id || 'Ẩn danh'}</span>
                    </div>
                    {article.published_at && (
                        <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Ngày đăng: {formatDate(article.published_at)}</span>
                        </div>
                    )}
                </div>

                <div
                    className="prose prose-lg max-w-none dark:prose-invert mb-6"
                    dangerouslySetInnerHTML={{ __html: contentWithoutFirstAnchor }}
                />
                <div className='flex justify-center'>
                    {originalLink && (
                        <a
                            href={originalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Bài viết gốc
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail; 