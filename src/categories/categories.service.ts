import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';

@Injectable()
export class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.category.findMany();
  }

  async getById(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      include: {
        articles: true,
      },
    });
    if (!category) {
      throw new NotFoundException();
    }
    return category;
  }

  create(category: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: {
        name: category.name,
      },
    });
  }

  async update(id: number, category: UpdateCategoryDto) {
    try {
      return await this.prismaService.category.update({
        data: {
          name: category.name,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.category.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async deleteCategoryWithArticles(categoryId: number) {
    return this.prismaService.$transaction(async (transactionClient) => {
      const category = await transactionClient.category.findUnique({
        where: {
          id: categoryId,
        },
        include: {
          articles: true,
        },
      });
      if (!category) {
        throw new NotFoundException();
      }

      const articleIds = category.articles.map((article) => article.id);

      await transactionClient.article.deleteMany({
        where: {
          id: {
            in: articleIds,
          },
        },
      });

      await transactionClient.category.delete({
        where: {
          id: categoryId,
        },
      });
    });
  }
}
