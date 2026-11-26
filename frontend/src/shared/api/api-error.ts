export class ApiError extends Error {
  constructor(status: number, body?: unknown) {
    super(`HTTP ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }

  readonly status: number;
  readonly body?: unknown;
}
