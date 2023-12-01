import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaError } from '../database/prisma-error.enum';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { UserDto } from './dto/user.dto';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        address: true,
        Article: true,
        profileImage: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        Article: true,
        profileImage: true,
      },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async create(user: UserDto) {
    try {
      return this.prismaService.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
          phoneNumber: user.phoneNumber,
          address: {
            create: user.address,
          },
          profileImage: {
            create: user.profileImage,
          },
        },
        include: {
          address: true,
          profileImage: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error?.code === PrismaError.UniqueConstraintFailed
      ) {
        throw new ConflictException('User with that email already exists');
      }
      throw error;
    }
  }

  async updatePhoneNumber(id: number, user: UpdatePhoneNumberDto) {
    try {
      return await this.prismaService.user.update({
        data: {
          phoneNumber: user.phoneNumber,
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

  async deleteUser(queryParams: DeleteUserDto, currentUser: User) {
    if (queryParams.newAuthor) {
      return this.prismaService.$transaction(async (transactionClient) => {
        const articlesToReassign = await transactionClient.article.findMany({
          where: {
            authorId: currentUser.id,
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
        await transactionClient.user.delete({
          where: {
            id: currentUser.id,
          },
        });
      });
    } else {
      return this.prismaService.$transaction(async (transactionClient) => {
        await transactionClient.article.deleteMany({
          where: {
            authorId: currentUser.id,
          },
        });
        await transactionClient.user.delete({
          where: {
            id: currentUser.id,
          },
        });
      });
    }
  }
}
