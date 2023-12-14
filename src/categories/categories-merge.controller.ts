import { Controller, Patch, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';

@Controller('categories-merge')
export class CategoriesMergeController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Patch()
  @UseGuards(JwtAuthenticationGuard)
  mergeCategories() {
    return this.categoriesService.mergeDuplicateCategories();
  }
}
