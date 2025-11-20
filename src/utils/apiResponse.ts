class ApiResponse<T> {
  public data: T | undefined;
  public success: boolean;
  public message: string;

  constructor(message: string, data?: T) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
