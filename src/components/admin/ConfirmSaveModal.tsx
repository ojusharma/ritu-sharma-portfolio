import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sectionTitle: string;
  changes: string[];
  isSaving: boolean;
}

export default function ConfirmSaveModal({
  isOpen,
  onClose,
  onConfirm,
  sectionTitle,
  changes,
  isSaving,
}: ConfirmSaveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-700 bg-gray-800/80">
          <AlertTriangle size={24} className="text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">Confirm Changes</h3>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[50vh]">
          <p className="text-gray-300 mb-4">
            You're about to save the following changes to{' '}
            <span className="font-semibold text-primary">{sectionTitle}</span>:
          </p>

          <ul className="space-y-2">
            {changes.map((change, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <CheckCircle size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-700 bg-gray-800/80">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-light disabled:bg-primary/50 text-white rounded-lg font-medium transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Confirm & Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
