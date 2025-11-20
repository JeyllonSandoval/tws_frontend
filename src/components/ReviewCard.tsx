import { useState } from 'react';
import { HiOutlinePencil, HiOutlineTrash, HiOutlineCube, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineBell } from 'react-icons/hi2';
import type { Review } from '../types/review';
import ConfirmDialog from './ConfirmDialog';

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (id: number) => void;
}

function ReviewCard({ review, onEdit, onDelete }: ReviewCardProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const formatDate = (dateString: string) => {
    // Parse the date string from the database
    // If the string doesn't have timezone info, treat it as UTC and convert to local
    let date: Date;
    
    // Check if the date string includes timezone info (ends with Z or +)
    if (dateString.includes('Z') || dateString.includes('+') || dateString.includes('-', 10)) {
      // Date has timezone info, parse directly
      date = new Date(dateString);
    } else {
      // Date doesn't have timezone info, assume it's UTC and convert to local
      // Append 'Z' to indicate UTC timezone
      date = new Date(dateString.endsWith('Z') ? dateString : `${dateString}Z`);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    // Format the date in local timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: userTimezone,
    }).format(date);
  };

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(review.review_id);
    setShowConfirmDialog(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <div className="review-card">
      <div className="review-card-header">
        <div className="review-user-info">
          <h3 className="review-user-name">{review.user_name}</h3>
          <span className="review-contact">{review.contact_number}</span>
        </div>
        <div className="review-card-actions">
          <button
            className="btn btn-edit"
            onClick={() => onEdit(review)}
            aria-label="Edit review"
          >
            <HiOutlinePencil />
          </button>
          <button
            className="btn btn-delete"
            onClick={handleDeleteClick}
            aria-label="Delete review"
          >
            <HiOutlineTrash />
          </button>
        </div>
      </div>
      
      <div className="review-product-info">
        <h4 className="review-product-name">
          <HiOutlineCube className="product-icon" />
          {review.product_name}
        </h4>
      </div>

      <div className="review-content">
        <p className="review-text">{review.product_review}</p>
      </div>

      <div className="review-footer">
        <div className="review-preferences">
          <span className={`badge ${review.preferred_contact_again ? 'badge-success' : 'badge-neutral'}`}>
            {review.preferred_contact_again ? (
              <>
                <HiOutlineCheckCircle className="badge-icon" />
                Wants future contact
              </>
            ) : (
              <>
                <HiOutlineXCircle className="badge-icon" />
                No future contact
              </>
            )}
          </span>
          {review.preferred_contact_again && (
            <span className="badge badge-info">
              <HiOutlineBell className="badge-icon" />
              {review.preferred_contact_method}
            </span>
          )}
        </div>
        <div className="review-dates">
          <small className="review-date">
            Created: {formatDate(review.created_at)}
          </small>
          {review.updated_at !== review.created_at && (
            <small className="review-date">
              Updated: {formatDate(review.updated_at)}
            </small>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Delete Review"
        message={`Are you sure you want to delete the review from ${review.user_name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default ReviewCard;

