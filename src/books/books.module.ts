import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import BooksController from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
