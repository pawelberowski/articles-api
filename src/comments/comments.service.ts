import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../database/prisma-error.enum';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.comment.findMany();
  }

  async getById(id: number) {
    const comment = await this.prismaService.comment.findUnique({
      where: {
        id,
      },
      include: {
        article: true,
      },
    });
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  create(comment: CreateCommentDto) {
    return this.prismaService.comment.create({
      data: {
        text: comment.text,
        article: {
          connect: {
            id: comment.articleId,
          },
        },
      },
      include: {
        article: true,
      },
    });
  }

  async update(id: number, comment: UpdateCommentDto) {
    try {
      return await this.prismaService.comment.update({
        data: {
          text: comment.text,
        },
        where: {
          id,
        },
        include: {
          article: true,
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
      return await this.prismaService.comment.delete({
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
}
