import React from 'react';
import { AlertTriangle, X, Loader } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmColor?: 'red' | 'blue' | 'green' | 'gray';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  confirmColor = 'blue',
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;
  
  const getButtonColor = () => {
    switch (confirmColor) {
      case 'red':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'green':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      case 'gray':
        return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onCancel} // Close when clicking outside
      ></div>
      
      <div className="relative bg-white rounded-lg max-w-md w-full mx-auto shadow-xl transform transition-all z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center text-gray-900">
              {confirmColor === 'red' && (
                <AlertTriangle size={20} className="text-red-500 mr-2" />
              )}
              {title}
            </h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 rounded-full"
              onClick={onCancel}
            >
              <X size={20} />
            </button>
          </div>
          <div className="mb-6">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${getButtonColor()} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin mr-2" />
                  <span>Processando...</span>
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;