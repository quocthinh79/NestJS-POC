interface ApiResponse<TData = null> {
  data: TData | null;
  status: number;
  errorMessage: string;
  errorCode: string;
  success?: boolean;
}

type Pagination = {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
};

interface ResponsePaging<T> extends ApiResponse<T> {
  paging: Pagination;
}

export type { ApiResponse, ResponsePaging };
