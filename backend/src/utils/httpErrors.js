export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status; 
    this.code = code; 
    this.details = details;
  }
}

export class BadRequest extends HttpError {
  constructor(message='Bad Request', details) { 
    super(400,'VALIDATION_ERROR',message,details); 
  }
}

export class NotFound extends HttpError {
  constructor(message='Not Found') { 
    super(404,'NOT_FOUND',message); 
  }
}