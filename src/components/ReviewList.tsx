import { useState, useEffect, useMemo } from 'react';
import { HiOutlineArrowPath, HiOutlineSquares2X2, HiOutlineTableCells, HiOutlinePencilSquare , HiOutlineTrash, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineBell, HiOutlineArrowUp, HiOutlineArrowDown, HiOutlineArrowsUpDown } from 'react-icons/hi2';
import type { Review } from '../types/review';
import { api, ApiError } from '../services/api';
import ReviewCard from './ReviewCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ConfirmDialog from './ConfirmDialog';

interface ReviewListProps {
  onEdit: (review: Review) => void;
  onDelete: (id: number) => void;
  refreshTrigger: number;
  onRefresh: () => void;
}

type SortField = 'name' | 'contact_preference' | 'created_at' | 'updated_at' | null;
type SortDirection = 'asc' | 'desc';

function ReviewList({ onEdit, onDelete, refreshTrigger, onRefresh }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  const handleDeleteClick = (id: number, name: string) => {
    setDeleteConfirm({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await api.deleteReview(deleteConfirm.id);
      await loadReviews();
      onDelete(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(`Error deleting: ${err.message}`);
      } else {
        alert('Error deleting review. Please try again.');
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

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

  const formatDate = (dateString: string) => {
    let date: Date;
    
    if (dateString.includes('Z') || dateString.includes('+') || dateString.includes('-', 10)) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString.endsWith('Z') ? dateString : `${dateString}Z`);
    }
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> no sort
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        // Reset to no sort
        setSortField(null);
        setSortDirection('asc');
      }
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedReviews = useMemo(() => {
    if (!sortField) return reviews;

    return [...reviews].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.user_name.localeCompare(b.user_name);
          break;
        case 'contact_preference':
          // Sort by preferred_contact_again: true first, then false
          if (a.preferred_contact_again === b.preferred_contact_again) {
            comparison = 0;
          } else {
            comparison = a.preferred_contact_again ? -1 : 1;
          }
          break;
        case 'created_at':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case 'updated_at':
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
        default:
          return 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [reviews, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <HiOutlineArrowsUpDown className="sort-icon" />;
    }
    if (sortDirection === 'asc') {
      return <HiOutlineArrowUp className="sort-icon sort-icon-active" />;
    } else if (sortDirection === 'desc') {
      return <HiOutlineArrowDown className="sort-icon sort-icon-active" />;
    }
    return <HiOutlineArrowsUpDown className="sort-icon" />;
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
        <div className="section-header-actions">
          <div className="view-toggle">
            <button
              className={`btn btn-toggle ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              aria-label="Card view"
              title="Card view"
            >
              <HiOutlineSquares2X2 />
            </button>
            <button
              className={`btn btn-toggle ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              aria-label="Table view"
              title="Table view"
            >
              <HiOutlineTableCells />
            </button>
          </div>
          <button 
            className="btn btn-secondary btn-refresh" 
            onClick={onRefresh}
            aria-label="Refresh reviews"
          >
            <HiOutlineArrowPath />
            Refresh
          </button>
        </div>
      </div>
      {viewMode === 'cards' ? (
        <>
          <div className="cards-sort-controls">
            <span className="sort-label">Sort by:</span>
            <button
              className={`btn btn-sort ${sortField === 'name' ? 'active' : ''}`}
              onClick={() => handleSort('name')}
              aria-label="Sort by name"
            >
              Name {getSortIcon('name')}
            </button>
            <button
              className={`btn btn-sort ${sortField === 'contact_preference' ? 'active' : ''}`}
              onClick={() => handleSort('contact_preference')}
              aria-label="Sort by contact preference"
            >
              Contact Preference {getSortIcon('contact_preference')}
            </button>
            <button
              className={`btn btn-sort ${sortField === 'created_at' ? 'active' : ''}`}
              onClick={() => handleSort('created_at')}
              aria-label="Sort by created date"
            >
              Created {getSortIcon('created_at')}
            </button>
            <button
              className={`btn btn-sort ${sortField === 'updated_at' ? 'active' : ''}`}
              onClick={() => handleSort('updated_at')}
              aria-label="Sort by updated date"
            >
              Updated {getSortIcon('updated_at')}
            </button>
          </div>
          <div className="review-grid">
            {sortedReviews.map((review) => (
              <ReviewCard
                key={review.review_id}
                review={review}
                onEdit={onEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="review-table-container">
          <table className="review-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('name')}>
                  <span className="th-content">
                    Name
                    {getSortIcon('name')}
                  </span>
                </th>
                <th>Phone</th>
                <th>Product</th>
                <th>Review</th>
                <th className="sortable" onClick={() => handleSort('contact_preference')}>
                  <span className="th-content">
                    Contact Preference
                    {getSortIcon('contact_preference')}
                  </span>
                </th>
                <th className="sortable" onClick={() => handleSort('created_at')}>
                  <span className="th-content">
                    Created
                    {getSortIcon('created_at')}
                  </span>
                </th>
                <th className="sortable" onClick={() => handleSort('updated_at')}>
                  <span className="th-content">
                    Updated
                    {getSortIcon('updated_at')}
                  </span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedReviews.map((review) => (
                <tr key={review.review_id}>
                  <td className="table-cell-name">{review.user_name}</td>
                  <td className="table-cell-phone">{review.contact_number}</td>
                  <td className="table-cell-product">{review.product_name}</td>
                  <td className="table-cell-review">{review.product_review}</td>
                  <td className="table-cell-preference">
                    <div className="table-preferences">
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
                  </td>
                  <td className="table-cell-date">{formatDate(review.created_at)}</td>
                  <td className="table-cell-date">
                    {review.updated_at !== review.created_at ? formatDate(review.updated_at) : '-'}
                  </td>
                  <td className="table-cell-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => onEdit(review)}
                      aria-label="Edit review"
                      title="Edit"
                    >
                      <HiOutlinePencilSquare />
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteClick(review.review_id, review.user_name)}
                      aria-label="Delete review"
                      title="Delete"
                    >
                      <HiOutlineTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          title="Delete Review"
          message={`Are you sure you want to delete the review from ${deleteConfirm.name}? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default ReviewList;

