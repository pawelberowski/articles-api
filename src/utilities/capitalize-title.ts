import { TransformFnParams } from 'class-transformer';

export function capitalizeTitle({ value }: TransformFnParams) {
  return value[0].toUpperCase() + value.substring(1);
}
