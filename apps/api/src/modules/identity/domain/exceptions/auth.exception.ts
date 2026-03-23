export class AuthException extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 401,
  ) {
    super(message);
    this.name = 'AuthException';
  }
}

export class InvalidCredentialsException extends AuthException {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS', 401);
  }
}

export class UserDeactivatedException extends AuthException {
  constructor() {
    super('User account is deactivated', 'USER_DEACTIVATED', 401);
  }
}

export class TokenExpiredException extends AuthException {
  constructor() {
    super('Token has expired', 'TOKEN_EXPIRED', 401);
  }
}

export class InvalidTokenException extends AuthException {
  constructor() {
    super('Invalid token', 'INVALID_TOKEN', 401);
  }
}

export class SessionExpiredException extends AuthException {
  constructor() {
    super('Session has expired', 'SESSION_EXPIRED', 401);
  }
}

export class InsufficientPermissionsException extends AuthException {
  constructor(requiredRoles: string[]) {
    super(
      `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      'INSUFFICIENT_PERMISSIONS',
      403,
    );
  }
}

export class OrganizationAccessDeniedException extends AuthException {
  constructor() {
    super('Access to this organization is not allowed', 'ORG_ACCESS_DENIED', 403);
  }
}

export class EmailAlreadyExistsException extends AuthException {
  constructor(email: string) {
    super(`Email ${email} is already registered`, 'EMAIL_EXISTS', 409);
  }
}
