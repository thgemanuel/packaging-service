import { ValidationError } from 'class-validator';

export class DomainException extends Error {
  private errors: string[];

  constructor(errors: string[]) {
    super(errors.join(', '));
    this.errors = errors;
    this.name = DomainException.name;
  }

  getErrors() {
    return this.errors;
  }
}

export function resolveRecursivelyMessages(
  error: ValidationError,
  errorList: string[],
) {
  const hasChildren = error.children?.length > 0;

  if (!hasChildren) {
    errorList.push(
      `${error.target.constructor.name} has following errors: [${Object.keys(
        error.constraints,
      )
        .map((key) => error.constraints[key])
        .join(', ')}]`,
    );

    return;
  }

  error.children?.forEach((error) =>
    resolveRecursivelyMessages(error, errorList),
  );
}
