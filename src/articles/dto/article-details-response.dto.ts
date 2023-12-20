import { Transform } from 'class-transformer';
import { capitalizeTitle } from '../../utilities/capitalize-title';
import { Article } from '@prisma/client';

export class ArticleDetailsResponseDto implements Article {
  id: number;
  @Transform(capitalizeTitle)
  title: string;
  text: string | null;
  authorId: number;
  upvotes: number;
}
