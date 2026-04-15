const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Confirm", 
    message = "Are you sure?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDangerous = false,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h2>
                <p className="text-gray-600 mb-8 text-base">
                    {message}
                </p>
                <div className="flex gap-3 flex-col sm:flex-row">
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                            isDangerous
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-60"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
