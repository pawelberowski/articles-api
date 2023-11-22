import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LogInDto } from './dto/log-in.dto';
import { Response } from 'express';
import { JwtAuthenticationGuard } from './jwt-authentication.guard';
import { RequestWithUser } from './request-with-user.interface';
import { AuthenticationResponseDto } from './dto/authentication-response.dto';
import { TransformPlainToInstance } from 'class-transformer';
import { UpdatePhoneNumberDto } from '../users/dto/update-phone-number.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  @TransformPlainToInstance(AuthenticationResponseDto)
  signUp(@Body() signUpData: SignUpDto) {
    return this.authenticationService.signUp(signUpData);
  }

  @HttpCode(200)
  @Post('log-in')
  @TransformPlainToInstance(AuthenticationResponseDto)
  async logIn(
    @Body() logInData: LogInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user =
      await this.authenticationService.getAuthenticatedUser(logInData);
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    return user;
  }

  @HttpCode(200)
  @Post('log-out')
  async logOut(@Res({ passthrough: true }) response: Response) {
    const cookie = this.authenticationService.getCookieForLogOut();
    response.setHeader('Set-Cookie', cookie);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch('update-phone-number')
  @TransformPlainToInstance(AuthenticationResponseDto)
  async updatePhoneNumber(
    @Req() request: RequestWithUser,
    @Body() phoneNumber: UpdatePhoneNumberDto,
  ) {
    const userId = request.user.id;
    return this.authenticationService.updatePhoneNumber(userId, phoneNumber);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  @TransformPlainToInstance(AuthenticationResponseDto)
  authenticate(@Req() request: RequestWithUser) {
    return request.user;
  }
}
