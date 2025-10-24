import React from 'react';
import { CloseIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses: Record<typeof size, string> = {
    sm: 'w-11/12 md:w-1/2 lg:w-1/3',
    md: 'w-11/12 md:w-2/3 lg:w-1/2',
    lg: 'w-11/12 md:w-3/4 lg:w-2/3',
    xl: 'w-11/12 md:w-5/6 lg:w-3/4',
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center animate-fade-in" onClick={onClose}>
      <div
        className={`bg-neutral-50 rounded-xl shadow-2xl p-6 relative transform transition-all duration-300 ease-out ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
          <h3 className="text-2xl font-bold text-neutral-800">{title}</h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;