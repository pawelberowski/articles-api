import { Controller, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { CategoriesMergeService } from './categories-merge.service';

@Controller('categories-merge')
export class CategoriesMergeController {
  constructor(
    private readonly categoriesMergeService: CategoriesMergeService,
  ) {}

  @Patch()
  @UseGuards(JwtAuthenticationGuard)
  mergeCategories() {
    return this.categoriesMergeService.mergeDuplicateCategories();
  }
}
