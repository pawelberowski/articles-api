import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { TransformPlainToInstance } from 'class-transformer';
import { ArticlesResponseDto } from './dto/articles-response.dto';
import { ArticleResponseDto } from './dto/article-response.dto';

@Controller('articles')
export default class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @TransformPlainToInstance(ArticlesResponseDto)
  getAll() {
    return this.articlesService.getAll();
  }

  @Get(':id')
  @TransformPlainToInstance(ArticleResponseDto)
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @TransformPlainToInstance(ArticlesResponseDto)
  create(@Body() article: CreateArticleDto) {
    return this.articlesService.create(article);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @TransformPlainToInstance(ArticleResponseDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() article: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, article);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @TransformPlainToInstance(ArticleResponseDto)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.articlesService.delete(id);
  }
}
