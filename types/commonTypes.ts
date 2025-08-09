/**
 * Common types used across the application
 */

/**
 * Props interface for Next.js App Router pages
 * @template T - Type for the params object
 * @template S - Type for the searchParams object (optional)
 */
export interface PageProps<T = { id: string }, S = { [key: string]: string | string[] | undefined }> {
  params: Promise<T>;
  searchParams?: Promise<S>;
}

/**
 * Common response type for API endpoints
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Common pagination params
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Common pagination response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 