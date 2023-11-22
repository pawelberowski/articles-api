import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthenticationGuard } from '../authentication/jwt-authentication.guard';
import { RequestWithUser } from '../authentication/request-with-user.interface';
import { UpdatePhoneNumberDto } from './dto/update-phone-number.dto';

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
}
