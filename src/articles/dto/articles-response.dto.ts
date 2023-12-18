import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { capitalizeTitle } from '../../utilities/capitalize-title';
import { Article } from '@prisma/client';

function shortenText({ value: text }: TransformFnParams) {
  if (!text) {
    return null;
  }
  if (text.length > 100) {
    return `${text.substring(0, 98)}...`;
  }
  return text;
}

function getTextLength({ obj }: TransformFnParams) {
  if (!obj.text) {
    return null;
  }
  return obj.text.length;
}

export class ArticlesResponseDto implements Article {
  id: number;
  @Transform(capitalizeTitle)
  title: string;

  @Transform(shortenText)
  text: string | null;

  @Expose()
  @Transform(getTextLength)
  textLength: number | null;

  authorId: number;

  upvotes: number;
}
