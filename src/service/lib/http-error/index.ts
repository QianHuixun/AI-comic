export class HttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

export function getErrorStatusCode(error: unknown): number {
  if (error instanceof HttpError) {
    return error.statusCode;
  }

  return 500;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "服务器内部错误";
}
