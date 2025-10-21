interface ApiResponse<TData = null> {
  data: TData | null;
  status: number;
  errorMessage: string;
  errorCode: string;
  success?: boolean;
}

export type { ApiResponse };
