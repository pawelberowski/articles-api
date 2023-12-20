import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
