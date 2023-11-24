import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
