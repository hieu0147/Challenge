import { Newspaper } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg mr-3">
                                <Newspaper className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">News</h3>
                                <p className="text-md text-gray-500 dark:text-gray-300">Cập nhật những tin tức mới nhất.</p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 text-justify text-md">
                            Nguồn tin cậy của bạn về những tin tức và góc nhìn mới nhất trong các lĩnh vực công nghệ, kinh doanh, khoa học và nhiều hơn nữa. Luôn kết nối với những điều quan trọng nhất.
                        </p>
                    </div>

                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
                    <p>&copy; 2025 News. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
} 