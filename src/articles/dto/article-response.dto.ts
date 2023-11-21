import { Article } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { capitalizeTitle } from './articles-response.dto';

export class ArticleResponseDto implements Article {
  id: number;
  @IsString()
  @IsNotEmpty()
  @Transform(capitalizeTitle)
  title: string;

  @IsString()
  @IsOptional()
  text: string | null;
}
