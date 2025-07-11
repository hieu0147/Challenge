import React, { useState, useEffect } from 'react';

const ScrollToTopButton: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return visible ? (
        <button
            onClick={handleClick}
            className="fixed bottom-3 right-4 z-50 w-12 h-12 flex items-center justify-center p-0 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Lên đầu trang"
        >
            <span className="text-2xl">↑</span>
        </button>
    ) : null;
};

export default ScrollToTopButton; 