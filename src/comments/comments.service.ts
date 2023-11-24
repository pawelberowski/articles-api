import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

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
}
