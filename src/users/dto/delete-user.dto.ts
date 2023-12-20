import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteUserDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  newAuthor?: number;
}
