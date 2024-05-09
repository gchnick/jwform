export class InvalidArgumentError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}
