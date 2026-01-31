export type PaginatedResponse<T> = {
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
};

export type ApiError = {
  message: string;
  status: number;
};
