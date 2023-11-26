import { Transform } from 'class-transformer';
import { capitalizeTitle } from '../../utilities/capitalize-title';

export class ArticleDetailsResponseDto {
  id: number;
  @Transform(capitalizeTitle)
  title: string;
  text: string | null;
  upvotes: number;
}
