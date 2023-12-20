import { CanBeUndefined } from '../../utilities/can-be-undefined';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetArticlesByUpvotesDto {
  @CanBeUndefined()
  @IsNumber()
  @Type(() => Number)
  upvotesFewerThan?: number;
}
