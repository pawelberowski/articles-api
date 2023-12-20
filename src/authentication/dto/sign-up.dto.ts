import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsPhoneNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from '../../users/dto/address.dto';
import { CanBeUndefined } from '../../utilities/can-be-undefined';
import { Type } from 'class-transformer';
import { ProfileImageDto } from '../../users/dto/profile-image.dto';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string | null;

  @CanBeUndefined()
  @Type(() => AddressDto)
  @IsObject()
  @ValidateNested()
  address?: AddressDto;

  @CanBeUndefined()
  @Type(() => ProfileImageDto)
  @IsObject()
  @ValidateNested()
  profileImage?: ProfileImageDto;
}
