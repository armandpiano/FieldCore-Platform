/**
 * Domain Exceptions
 * Custom exceptions for business rule violations
 */

export abstract class DomainException extends Error {
  abstract readonly code: string;
  abstract readonly httpStatus: number;

  constructor(
    message: string,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class EntityNotFoundException extends DomainException {
  readonly code = 'ENTITY_NOT_FOUND';
  readonly httpStatus = 404;

  constructor(entityName: string, id: string | number) {
    super(`${entityName} with id ${id} not found`);
  }
}

export class InvalidStateException extends DomainException {
  readonly code = 'INVALID_STATE';
  readonly httpStatus = 400;

  constructor(message: string, currentState?: string) {
    super(message, { currentState });
  }
}

export class BusinessRuleException extends DomainException {
  readonly code = 'BUSINESS_RULE_VIOLATED';
  readonly httpStatus = 422;

  constructor(message: string, rule?: string) {
    super(message, { rule });
  }
}

export class ForbiddenException extends DomainException {
  readonly code = 'FORBIDDEN';
  readonly httpStatus = 403;

  constructor(message: string = 'Access denied') {
    super(message);
  }
}
