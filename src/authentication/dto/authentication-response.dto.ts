import { Address, User } from '@prisma/client';
import { Exclude, Transform, TransformFnParams } from 'class-transformer';

function obscurePhoneNumber({ value: phoneNumber }: TransformFnParams) {
  if (!phoneNumber) {
    return null;
  }
  const numberLength = phoneNumber.length;
  const visiblePart = phoneNumber.substring(numberLength - 3, numberLength);
  return `${'*'.repeat(numberLength - 3)}${visiblePart}`;
}

export class AuthenticationResponseDto implements User {
  id: number;
  email: string;
  name: string;

  @Transform(obscurePhoneNumber)
  phoneNumber: string | null;

  @Exclude()
  password: string;

  addressId: number;

  address?: Address;
}
