import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ChangeAuthorsDto {
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  previousAuthor: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  newAuthor: number;
}
