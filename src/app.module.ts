import { Module } from '@nestjs/common';
import { ArticlesModule } from './articles/articles.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication/authentication.module';
import * as Joi from 'joi';
import { CategoriesModule } from './categories/categories.module';
import { CommentsModule } from './comments/comments.module';
import { BooksModule } from './books/books.module';

@Module({
  imports: [
    ArticlesModule,
    AuthenticationModule,
    CategoriesModule,
    CommentsModule,
    BooksModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
      }),
    }),
  ],
})
export class AppModule {}
