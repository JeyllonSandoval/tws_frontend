import { useState, useEffect } from 'react';
import { HiOutlinePencil, HiOutlineExclamationCircle } from 'react-icons/hi2';
import type { Review, ReviewUpdate } from '../types/review';
import { api, ApiError } from '../services/api';

interface ReviewFormProps {
  review: Review;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FieldErrors {
  contact_number?: string;
  user_name?: string;
  product_name?: string;
  product_review?: string;
  preferred_contact_method?: string;
}

function ReviewForm({ review, onSuccess, onCancel }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewUpdate>({
    contact_number: review.contact_number,
    user_name: review.user_name,
    product_name: review.product_name,
    product_review: review.product_review,
    preferred_contact_method: review.preferred_contact_method,
    preferred_contact_again: review.preferred_contact_again,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateContactNumber = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Contact number is required';
    }
    const phonePattern = /^\+?[1-9]\d{1,14}$/;
    if (!phonePattern.test(value.trim())) {
      return 'Invalid phone number format. Use format: +1234567890';
    }
    return undefined;
  };

  const validateUserName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'User name is required';
    }
    if (value.trim().length < 2) {
      return 'User name must be at least 2 characters';
    }
    if (value.trim().length > 128) {
      return 'User name must be less than 128 characters';
    }
    const namePattern = /^[a-zA-Z\s'-]+$/;
    if (!namePattern.test(value.trim())) {
      return 'User name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return undefined;
  };

  const validateProductName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Product name is required';
    }
    if (value.trim().length < 2) {
      return 'Product name must be at least 2 characters';
    }
    if (value.trim().length > 256) {
      return 'Product name must be less than 256 characters';
    }
    return undefined;
  };

  const validateProductReview = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Product review is required';
    }
    if (value.trim().length < 10) {
      return 'Product review must be at least 10 characters';
    }
    if (value.trim().length > 5000) {
      return 'Product review must be less than 5000 characters';
    }
    return undefined;
  };

  const validatePreferredContactMethod = (value: string, isRequired: boolean): string | undefined => {
    // Only validate if checkbox is active
    if (!isRequired) {
      return undefined;
    }
    if (!value.trim()) {
      return 'Preferred contact method is required';
    }
    return undefined;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    
    errors.contact_number = validateContactNumber(formData.contact_number);
    errors.user_name = validateUserName(formData.user_name);
    errors.product_name = validateProductName(formData.product_name);
    errors.product_review = validateProductReview(formData.product_review);
    
    // Only validate preferred_contact_method if checkbox is active
    if (formData.preferred_contact_again) {
      errors.preferred_contact_method = validatePreferredContactMethod(
        formData.preferred_contact_method,
        true
      );
    }

    setFieldErrors(errors);
    
    // Mark fields as touched
    const touchedFields: Record<string, boolean> = {
      contact_number: true,
      user_name: true,
      product_name: true,
      product_review: true,
    };
    
    if (formData.preferred_contact_again) {
      touchedFields.preferred_contact_method = true;
    }
    
    setTouched(touchedFields);

    return !Object.values(errors).some(error => error !== undefined);
  };

  // Validate single field
  const validateField = (name: keyof FieldErrors, value: string) => {
    if (!touched[name]) return;

    let error: string | undefined;
    
    switch (name) {
      case 'contact_number':
        error = validateContactNumber(value);
        break;
      case 'user_name':
        error = validateUserName(value);
        break;
      case 'product_name':
        error = validateProductName(value);
        break;
      case 'product_review':
        error = validateProductReview(value);
        break;
      case 'preferred_contact_method':
        error = validatePreferredContactMethod(value, formData.preferred_contact_again);
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  useEffect(() => {
    setFormData({
      contact_number: review.contact_number,
      user_name: review.user_name,
      product_name: review.product_name,
      product_review: review.product_review,
      preferred_contact_method: review.preferred_contact_method,
      preferred_contact_again: review.preferred_contact_again,
    });
    setError(null);
    setFieldErrors({});
    setTouched({});
  }, [review]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    const newFormData = {
      ...formData,
      [name]: fieldValue,
    };

    // If checkbox is unchecked, clear preferred_contact_method and its error
    if (name === 'preferred_contact_again' && !fieldValue) {
      newFormData.preferred_contact_method = '';
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.preferred_contact_method;
        return newErrors;
      });
      setTouched((prev) => {
        const newTouched = { ...prev };
        delete newTouched.preferred_contact_method;
        return newTouched;
      });
    }

    setFormData(newFormData);

    // Validate field if it has been touched
    if (touched[name]) {
      if (name === 'preferred_contact_method') {
        validateField(name as keyof FieldErrors, String(fieldValue));
      } else {
        validateField(name as keyof FieldErrors, String(fieldValue));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field
    validateField(name as keyof FieldErrors, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submit
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.updateReview(review.review_id, formData);
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error updating review. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-container">
      <h2 className="form-title">
        <HiOutlinePencil className="title-icon" />
        Edit Review
      </h2>
      
      {error && (
        <div className="error-message">
          <HiOutlineExclamationCircle className="error-icon" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="contact_number">
            Contact Number <span className="required">*</span>
          </label>
          <input
            type="tel"
            id="contact_number"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldErrors.contact_number ? 'error' : ''}
            placeholder="+1234567890"
          />
          {fieldErrors.contact_number && (
            <span className="field-error">
              <HiOutlineExclamationCircle className="error-icon-small" />
              {fieldErrors.contact_number}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="user_name">
            User Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldErrors.user_name ? 'error' : ''}
            placeholder="John Doe"
          />
          {fieldErrors.user_name && (
            <span className="field-error">
              <HiOutlineExclamationCircle className="error-icon-small" />
              {fieldErrors.user_name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="product_name">
            Product Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="product_name"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldErrors.product_name ? 'error' : ''}
            placeholder="Product X"
          />
          {fieldErrors.product_name && (
            <span className="field-error">
              <HiOutlineExclamationCircle className="error-icon-small" />
              {fieldErrors.product_name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="product_review">
            Product Review <span className="required">*</span>
          </label>
          <textarea
            id="product_review"
            name="product_review"
            value={formData.product_review}
            onChange={handleChange}
            onBlur={handleBlur}
            className={fieldErrors.product_review ? 'error' : ''}
            rows={6}
            placeholder="Write your review here..."
          />
          {fieldErrors.product_review ? (
            <span className="field-error">
              <HiOutlineExclamationCircle className="error-icon-small" />
              {fieldErrors.product_review}
            </span>
          ) : (
            <small className="form-hint">
              Minimum 10 characters, maximum 5000 characters
            </small>
          )}
        </div>

        <div className="form-group checkbox-group">
          <label htmlFor="preferred_contact_again" className="checkbox-label">
            <input
              type="checkbox"
              id="preferred_contact_again"
              name="preferred_contact_again"
              checked={formData.preferred_contact_again}
              onChange={handleChange}
            />
            <span>Wants to be contacted again</span>
          </label>
        </div>

        {formData.preferred_contact_again && (
          <div className="form-group">
            <label htmlFor="preferred_contact_method">
              Preferred Contact Method <span className="required">*</span>
            </label>
            <select
              id="preferred_contact_method"
              name="preferred_contact_method"
              value={formData.preferred_contact_method}
              onChange={handleChange}
              onBlur={handleBlur}
              className={fieldErrors.preferred_contact_method ? 'error' : ''}
            >
              <option value="">Select a method</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="SMS">SMS</option>
            </select>
            {fieldErrors.preferred_contact_method && (
              <span className="field-error">
                <HiOutlineExclamationCircle className="error-icon-small" />
                {fieldErrors.preferred_contact_method}
              </span>
            )}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;

