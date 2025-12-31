class ApiResponse<T> {
  public data: T;
  public message: string;
  public success: boolean;

  constructor(message: string, data: T) {
    this.data = data;
    this.message = message;
    this.success = true;
  }
}

export default ApiResponse;
