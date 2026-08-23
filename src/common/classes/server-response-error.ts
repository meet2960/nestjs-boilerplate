export class ServerResponseError extends Error {
  public errorData: any;

  constructor(message: string, errorData: any = {}) {
    super(message); // Call the parent constructor
    this.name = this.constructor.name; // Set the error name to the class name
    this.errorData = errorData ? errorData : null;
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace
  }
}
