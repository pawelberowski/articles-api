import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaError } from '../database/prisma-error.enum';
import { Prisma } from '@prisma/client';
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll() {
    return this.prismaService.book.findMany();
  }

  async getById(id: number) {
    const book = await this.prismaService.book.findUnique({
      where: {
        id,
      },
    });
    if (!book) {
      throw new NotFoundException();
    }
    return book;
  }

  create(book: CreateBookDto) {
    return this.prismaService.book.create({
      data: {
        title: book.title,
      },
    });
  }

  async update(id: number, book: UpdateBookDto) {
    const authors = book.authorsIds?.map((id) => {
      return {
        id,
      };
    });
    try {
      return await this.prismaService.book.update({
        data: {
          title: book.title,
          authors: {
            connect: authors,
          },
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
      return await this.prismaService.book.delete({
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
