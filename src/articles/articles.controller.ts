import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { TransformPlainToInstance } from 'class-transformer';
import { ArticlesResponseDto } from './dto/articles-response.dto';
import { ArticleDetailsResponseDto } from './dto/article-details-response.dto';
import { RequestWithUser } from '../authentication/request-with-user.interface';

@Controller('articles')
export default class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @TransformPlainToInstance(ArticlesResponseDto)
  getAll() {
    return this.articlesService.getAll();
  }

  @Get(':id')
  @TransformPlainToInstance(ArticleDetailsResponseDto)
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.articlesService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @TransformPlainToInstance(ArticlesResponseDto)
  create(@Body() article: CreateArticleDto, @Req() request: RequestWithUser) {
    return this.articlesService.create(article, request.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  @TransformPlainToInstance(ArticleDetailsResponseDto)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() article: UpdateArticleDto,
  ) {
    return this.articlesService.update(id, article);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  @TransformPlainToInstance(ArticleDetailsResponseDto)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.articlesService.delete(id);
  }

  @Post(':id/upvote')
  @UseGuards(JwtAuthenticationGuard)
  @TransformPlainToInstance(ArticleDetailsResponseDto)
  async upvote(@Param('id', ParseIntPipe) id: number) {
    await this.articlesService.upvote(id);
  }

  @Post(':id/downvote')
  @UseGuards(JwtAuthenticationGuard)
  @TransformPlainToInstance(ArticleDetailsResponseDto)
  async downvote(@Param('id', ParseIntPipe) id: number) {
    await this.articlesService.downvote(id);
  }

}
