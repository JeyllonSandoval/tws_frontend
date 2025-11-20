import { HiOutlineExclamationCircle } from 'react-icons/hi2';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-container">
      <div className="error-content">
        <HiOutlineExclamationCircle className="error-icon-large" />
        <h3>Error</h3>
        <p>{message}</p>
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;

