import type { Review, ReviewUpdate } from '../types/review';

const API_BASE_URL = 'https://tws-backend-jssr.up.railway.app';

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // If response is not JSON, use default error message
    }
    throw new ApiError(errorMessage, response.status, response.statusText);
  }

  // Check if response has content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  // Return empty object for 204 No Content or similar
  return {} as T;
}

export const api = {
  // Health check
  async healthCheck(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/`);
    return handleResponse<{ message: string }>(response);
  },

  // Get all reviews
  async getReviews(): Promise<Review[]> {
    const response = await fetch(`${API_BASE_URL}/reviews/`);
    return handleResponse<Review[]>(response);
  },

  // Get a single review by ID
  async getReview(id: number): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`);
    return handleResponse<Review>(response);
  },

  // Update a review
  async updateReview(id: number, data: ReviewUpdate): Promise<Review> {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Review>(response);
  },

  // Delete a review
  async deleteReview(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
    });
    await handleResponse<void>(response);
  },
};

export { ApiError };

