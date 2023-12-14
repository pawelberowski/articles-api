import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import CategoriesController from './categories.controller';
import { DatabaseModule } from '../database/database.module';
import { CategoriesMergeController } from './categories-merge.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [CategoriesController, CategoriesMergeController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
