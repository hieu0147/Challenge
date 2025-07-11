import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    ×
                </button>
                {title && <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>}
                {children}
            </div>
        </div>
    );
};

export default Modal; 