import { IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdatePhoneNumberDto {
  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string | null;
}
