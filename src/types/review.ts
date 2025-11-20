export interface Review {
  review_id: number;
  contact_number: string;
  user_name: string;
  product_name: string;
  product_review: string;
  preferred_contact_method: string;
  preferred_contact_again: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewUpdate {
  contact_number: string;
  user_name: string;
  product_name: string;
  product_review: string;
  preferred_contact_method: string;
  preferred_contact_again: boolean;
}

