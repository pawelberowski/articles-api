import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  text?: string;

  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title?: string;

  @CanBeUndefined()
  @IsNumber({}, { each: true })
  categoryIds?: number[];
}
