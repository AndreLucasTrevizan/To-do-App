export class AuthTokenError extends Error {
  constructor() {
    super('User unauthorized');
  }
}