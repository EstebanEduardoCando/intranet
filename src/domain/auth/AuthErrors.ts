/**
 * Base authentication error
 */
export abstract class AuthError extends Error {
  abstract readonly code: string;
  
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error thrown when authentication credentials are invalid
 */
export class AuthenticationError extends AuthError {
  readonly code = 'AUTH_INVALID_CREDENTIALS';
  
  constructor(message: string = 'Invalid email or password', cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when user registration fails
 */
export class RegistrationError extends AuthError {
  readonly code = 'AUTH_REGISTRATION_FAILED';
  
  constructor(message: string = 'Registration failed', cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when user is not authenticated
 */
export class UnauthorizedError extends AuthError {
  readonly code = 'AUTH_UNAUTHORIZED';
  
  constructor(message: string = 'User is not authenticated', cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when user session has expired
 */
export class SessionExpiredError extends AuthError {
  readonly code = 'AUTH_SESSION_EXPIRED';
  
  constructor(message: string = 'User session has expired', cause?: Error) {
    super(message, cause);
  }
}

/**
 * Error thrown when email is already in use
 */
export class EmailAlreadyInUseError extends AuthError {
  readonly code = 'AUTH_EMAIL_ALREADY_IN_USE';
  
  constructor(message: string = 'Email address is already in use', cause?: Error) {
    super(message, cause);
  }
}