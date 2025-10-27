export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  code: number;
  errorMessage: string | null;
  paging: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}

// Optional helper for controller typings
export const createSuccessResponse = <T>(data: T, code = 200): ApiResponse<T> => ({
  success: true,
  data,
  code,
  errorMessage: null,
  paging: null,
});
