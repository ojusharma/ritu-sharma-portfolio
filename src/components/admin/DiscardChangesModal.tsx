import { AlertTriangle, Trash2 } from 'lucide-react';

interface DiscardChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sectionTitle: string;
}

export default function DiscardChangesModal({
  isOpen,
  onClose,
  onConfirm,
  sectionTitle,
}: DiscardChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700 bg-gray-800/80">
          <AlertTriangle size={24} className="text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">Unsaved Changes</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <p className="text-gray-300">
            You have unsaved changes in{' '}
            <span className="font-semibold text-white">{sectionTitle}</span>.
          </p>
          <p className="text-gray-400 mt-2">
            Are you sure you want to switch sections? Your changes will be lost.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700 bg-gray-800/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Stay Here
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
          >
            <Trash2 size={18} />
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}
