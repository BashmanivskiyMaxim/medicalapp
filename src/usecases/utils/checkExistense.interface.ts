export interface IEntityValidator {
  existence(id: string, throwErrorIfExists: boolean): Promise<void>;
  uniqueness(id: string, throwErrorIfExists: boolean): Promise<void>;
}
