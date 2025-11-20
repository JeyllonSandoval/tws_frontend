import { HiOutlineExclamationTriangle, HiOutlineXMark } from 'react-icons/hi2';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="confirm-dialog-overlay" onClick={handleOverlayClick}>
      <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <div className="confirm-dialog-header">
          <div className="confirm-dialog-icon">
            <HiOutlineExclamationTriangle />
          </div>
          <button
            className="confirm-dialog-close"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <HiOutlineXMark />
          </button>
        </div>
        <div className="confirm-dialog-content">
          <h3 id="confirm-dialog-title" className="confirm-dialog-title">
            {title}
          </h3>
          <p className="confirm-dialog-message">{message}</p>
        </div>
        <div className="confirm-dialog-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            autoFocus
          >
            {cancelText}
          </button>
          <button
            className="btn btn-primary btn-confirm-delete"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;

