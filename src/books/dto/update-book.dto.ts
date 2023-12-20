import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CanBeUndefined } from '../../utilities/can-be-undefined';

export class UpdateBookDto {
  @IsString()
  @IsNotEmpty()
  title?: string;

  @CanBeUndefined()
  @IsNumber({}, { each: true })
  authorIds?: number[];
}
