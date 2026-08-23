import { cloneDeep } from 'lodash-es';

export interface ApiRequestOptions<TRequest = any, TResponse = any> {
  apiName: string;
  apiUrl: string;
  apiMethodType: 'get' | 'post' | 'patch' | 'put' | 'delete';
  apiStatus: string;
  request?: TRequest;
  response?: TResponse;
  durationMs?: number;
  headers?: Record<string, string> | null;
  metadataInfo?: Record<string, any> | null;
  errorMessage: string | null;
  internalRequestId: string | null;
  apiRequestId: string | null;
  errorStack?: string | null;
  [key: string]: any; // allow future extra fields
}

export class ApiRequestLogFactory<TRequest = any, TResponse = any> {
  public apiData: ApiRequestOptions<TRequest, TResponse>;

  constructor(
    options: Partial<ApiRequestOptions<TRequest, TResponse>> &
      Pick<ApiRequestOptions, 'apiName' | 'apiUrl' | 'internalRequestId'>,
  ) {
    this.apiData = {
      ...options,
      apiName: options.apiName,
      apiUrl: options.apiUrl,
      internalRequestId: options.internalRequestId,
      apiMethodType: options?.apiMethodType ?? 'post',
      request: options.request ?? ({} as TRequest),
      response: {} as TResponse,
      headers: options.headers ?? {},
      durationMs: options.durationMs ?? 0,
      metadataInfo: options.metadataInfo ?? null,
      apiStatus: options?.apiStatus ?? 'pending',
      errorMessage: options?.errorMessage ?? null,
      apiRequestId: options.apiRequestId ?? null,
      errorStack: options?.errorStack ?? null,
    };
  }

  // Set or update request payload
  setRequest(data: TRequest) {
    this.apiData.request = data;
  }

  // Set or update response payload
  setResponse(data: TResponse) {
    this.apiData.response = data;
  }

  // Reset request and response to defaults
  resetReqRes() {
    this.apiData.request = {} as TRequest;
    this.apiData.response = {} as TResponse;
  }

  // New method: update multiple fields at once
  setFields(fields: Partial<ApiRequestOptions<TRequest, TResponse>>) {
    this.apiData = {
      ...this.apiData,
      ...fields,
    };
  }

  // Update any arbitrary property runtime from any service
  setNewField(key: string, value: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.apiData[key] = value;
  }

  // Return a clone of current apiData (to avoid accidental mutation)
  getData(): ApiRequestOptions<TRequest, TResponse> {
    return cloneDeep(this.apiData);
  }

  async callApi<T>(apiCall: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    try {
      const response = await apiCall();
      const endTime = Date.now();
      this.apiData.durationMs = endTime - startTime;
      return response;
    } catch (error: any) {
      const endTime = Date.now();
      this.apiData.durationMs = endTime - startTime;
      throw error;
    }
  }
}
