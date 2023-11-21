import { Article } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
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

export function capitalizeTitle(title: string) {
  return title[0].toUpperCase() + title.substring(1);
}

export class ArticlesResponseDto implements Article {
  id: number;
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    return capitalizeTitle(value);
  })
  title: string;

  @IsOptional()
  @Transform(({ value }) => {
    return shortenText(value);
  })
  text: string | null;

  @Expose()
  @Transform(({ obj }) => {
    if (!obj.text) {
      return null;
    }
    return obj.text?.length;
  })
  textLength: string | null;
}
