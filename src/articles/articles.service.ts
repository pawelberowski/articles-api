import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import { ArticleNotFoundException } from './article-not-found.exception';
import { UpdateArticleDto } from './dto/update-article.dto';
import { GetArticlesByUpvotesDto } from './dto/get-articles-by-upvotes.dto';
import { ChangeAuthorsDto } from './dto/change-authors.dto';

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.article.findMany();
  }

  async getById(id: number) {
    const article = await this.prismaService.article.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
        categories: true,
      },
    });
    if (!article) {
      throw new ArticleNotFoundException(id);
    }
    return article;
  }

  async create(article: CreateArticleDto, authorId: number) {
    const categories = article.categoryIds?.map((id) => {
      return {
        id,
      };
    });

    try {
      return await this.prismaService.article.create({
        data: {
          title: article.title,
          text: article.text,
          author: {
            connect: {
              id: authorId,
            },
          },
          categories: {
            connect: categories,
          },
        },
        include: {
          categories: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new BadRequestException('Wrong category id provided');
      }
      throw error;
    }
  }

  async update(id: number, article: UpdateArticleDto) {
    const categories = article.categoryIds?.map((id) => {
      return {
        id,
      };
    });

    try {
      return await this.prismaService.article.update({
        data: {
          title: article.title,
          text: article.text,
          categories: {
            connect: categories,
          },
        },
        where: {
          id,
        },
        include: {
          categories: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new ArticleNotFoundException(id);
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.article.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new ArticleNotFoundException(id);
      }
      throw error;
    }
  }

  deleteMultipleArticles(ids: number[]) {
    return this.prismaService.$transaction(async (transactionClient) => {
      const deleteResponse = await transactionClient.article.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      if (deleteResponse.count !== ids.length) {
        throw new NotFoundException('One of the articles could not be deleted');
      }
    });
  }

  upvote(id: number) {
    return this.prismaService.article.update({
      where: {
        id,
      },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });
  }

  downvote(id: number) {
    return this.prismaService.article.update({
      where: {
        id,
      },
      data: {
        upvotes: {
          decrement: 1,
        },
      },
    });
  }

  deleteByUpvotes(queryParams: GetArticlesByUpvotesDto) {
    return this.prismaService.$transaction(async (transactionClient) => {
      const articlesToDelete = await transactionClient.article.findMany({
        where: {
          upvotes: {
            lt: queryParams.upvotesFewerThan,
          },
        },
      });
      if (!articlesToDelete.length) {
        throw new NotFoundException('There are no articles to delete');
      }
      const articleIds = articlesToDelete.map((article) => article.id);
      const deleteResponse = await transactionClient.article.deleteMany({
        where: {
          id: {
            in: articleIds,
          },
        },
      });
      if (deleteResponse.count !== articleIds.length) {
        throw new NotFoundException('One of the articles could not be deleted');
      }
    });
  }

  changeAuthors(queryParams: ChangeAuthorsDto) {
    return this.prismaService.$transaction(async (transactionClient) => {
      const articlesToReassign = await transactionClient.article.findMany({
        where: {
          authorId: queryParams.previousAuthor,
        },
      });
      if (!articlesToReassign.length) {
        throw new NotFoundException('No articles to reassign');
      }
      const articleIds = articlesToReassign.map((article) => article.id);
      const updateResponse = await transactionClient.article.updateMany({
        where: {
          id: {
            in: articleIds,
          },
        },
        data: {
          authorId: queryParams.newAuthor,
        },
      });
      if (updateResponse.count !== articleIds.length) {
        throw new NotFoundException(
          'One of the articles could not be reassigned',
        );
      }
    });
  }
}
