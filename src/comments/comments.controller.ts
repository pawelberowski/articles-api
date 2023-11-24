import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  create(@Body() comment: CreateCommentDto) {
    return this.commentsService.create(comment);
  }
}
