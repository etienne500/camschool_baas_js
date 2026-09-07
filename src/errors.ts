export class BaasError extends Error {
  public statusCode?: number;
  public details?: any;

  constructor(message: string, statusCode?: number, details?: any) {
    super(message);
    this.name = 'BaasError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class BaasAuthError extends BaasError {
  constructor(message: string, statusCode = 401, details?: any) {
    super(message, statusCode, details);
    this.name = 'BaasAuthError';
  }
}

export class BaasPermissionError extends BaasError {
  constructor(message: string, statusCode = 403, details?: any) {
    super(message, statusCode, details);
    this.name = 'BaasPermissionError';
  }
}

export class BaasNotFoundError extends BaasError {
  constructor(message: string, statusCode = 404, details?: any) {
    super(message, statusCode, details);
    this.name = 'BaasNotFoundError';
  }
}

export class BaasQuotaError extends BaasError {
  constructor(message: string, statusCode = 429, details?: any) {
    super(message, statusCode, details);
    this.name = 'BaasQuotaError';
  }
}
