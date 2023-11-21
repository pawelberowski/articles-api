import { Article } from '@prisma/client';
import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

function shortenText(text: string) {
  if (!text) {
    return null;
  }
  if (text.length > 100) {
    return `${text.substring(0, 98)}${'.'.repeat(3)}`;
  }
  return text;
}

export function capitalizeTitle({ value }: TransformFnParams) {
  return value[0].toUpperCase() + value.substring(1);
}

function getTextLength({ obj }: TransformFnParams) {
  if (!obj.text) {
    return null;
  }
  return obj.text.length;
}

export class ArticlesResponseDto implements Article {
  id: number;
  @IsString()
  @IsNotEmpty()
  @Transform(capitalizeTitle)
  title: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    return shortenText(value);
  })
  text: string | null;

  @Expose()
  @Transform(getTextLength)
  textLength: number | null;
}
