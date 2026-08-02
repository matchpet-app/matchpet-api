import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'atLeastOneProfile', async: false })
class AtLeastOneProfileConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const dto = args.object as { adotante?: unknown; doador?: unknown };
    return Boolean(dto.adotante) || Boolean(dto.doador);
  }

  defaultMessage(): string {
    return 'Informe ao menos um perfil: adotante ou doador';
  }
}

export function AtLeastOneProfile(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'atLeastOneProfile',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: AtLeastOneProfileConstraint,
    });
  };
}
