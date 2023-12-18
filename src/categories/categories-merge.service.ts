import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesMergeService {
  constructor(private readonly prismaService: PrismaService) {}

  async mergeDuplicateCategories() {
    return this.prismaService.$transaction(async (transactionClient) => {
      const allCategories = await transactionClient.category.findMany({
        include: { articles: true },
      });
      const uniqueCategories: { [name: string]: Category } = {};

      await Promise.all(
        allCategories.map(async (category) => {
          if (!(category.name in uniqueCategories)) {
            return (uniqueCategories[category.name] = category);
          }
          const categoryToMoveArticlesTo = uniqueCategories[category.name];
          const articlesToMove = category.articles;

          await transactionClient.category.update({
            where: { id: categoryToMoveArticlesTo.id },
            data: {
              articles: {
                connect: articlesToMove.map((article) => ({
                  id: article.id,
                })),
              },
            },
          });

          await transactionClient.category.delete({
            where: { id: category.id },
          });
        }),
      );
    });
  }
}
