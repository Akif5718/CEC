export interface ResultModel<T> {
    data?: T;
    isSuccess: boolean;
    message?: string;
    errorMessages?: string[];
  }
  