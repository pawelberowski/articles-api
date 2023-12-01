import {
  Body,
  Controller,
  Delete,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/request-with-user.interface';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Patch('update-phone-number')
  async updatePhoneNumber(
    @Req() request: RequestWithUser,
    @Body() phoneNumber: UpdatePhoneNumberDto,
  ) {
    const userId = request.user.id;
    return this.usersService.updatePhoneNumber(userId, phoneNumber);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete()
  async deleteCurrentUser(
    @Req() request: RequestWithUser,
    @Query() queryParams: DeleteUserDto,
  ) {
    const currentUser = request.user;
    await this.usersService.deleteUser(queryParams, currentUser);
  }
}
