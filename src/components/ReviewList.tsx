import { useState, useEffect } from 'react';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import type { Review } from '../types/review';
import { api, ApiError } from '../services/api';
import ReviewCard from './ReviewCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

interface ReviewListProps {
  onEdit: (review: Review) => void;
  onDelete: (id: number) => void;
  refreshTrigger: number;
  onRefresh: () => void;
}

function ReviewList({ onEdit, onDelete, refreshTrigger, onRefresh }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = async () => {
    try {
      setError(null);
      const data = await api.getReviews();
      setReviews(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error loading reviews. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load reviews on mount and when refreshTrigger changes
    setLoading(true);
    loadReviews();
  }, [refreshTrigger]);

  useEffect(() => {
    // Auto-refresh every minute
    const interval = setInterval(() => {
      loadReviews();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.deleteReview(id);
      await loadReviews();
      onDelete(id);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Error deleting: ${err.message}`);
      } else {
        alert('Error deleting review. Please try again.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadReviews} />;
  }

  if (reviews.length === 0) {
    return (
      <div className="empty-state">
        <p>No reviews available.</p>
        <p className="empty-state-subtitle">Reviews will appear here when added.</p>
      </div>
    );
  }

  return (
    <div className="review-list">
      <div className="section-header">
        <h2 className="section-title">
          Reviews ({reviews.length})
        </h2>
        <button 
          className="btn btn-secondary btn-refresh" 
          onClick={onRefresh}
          aria-label="Refresh reviews"
        >
          <HiOutlineArrowPath />
          Refresh
        </button>
      </div>
      <div className="review-grid">
        {reviews.map((review) => (
          <ReviewCard
            key={review.review_id}
            review={review}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}

export default ReviewList;

