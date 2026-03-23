/**
 * Base Entity - DDD Pattern
 * All domain entities should extend this class
 */
export abstract class Entity<T> {
  protected readonly _id: T;

  constructor(id: T) {
    this._id = id;
  }

  get id(): T {
    return this._id;
  }

  equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }
    if (this === entity) {
      return true;
    }
    return this._id === entity._id;
  }

  abstract toPlainObject(): Record<string, any>;
}

export type EntityId = string | number;

export interface EntityFactory<T extends Entity<any>, Props> {
  create(props: Props): T;
  reconstitute(id: EntityId, props: Props): T;
}
