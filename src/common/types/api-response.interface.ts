export interface IApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
  error?: any;
  devError?: any;
  devData?: any;
  apiUid?: string;
}
