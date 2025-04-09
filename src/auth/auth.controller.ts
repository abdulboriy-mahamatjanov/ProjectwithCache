import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { RefreshGuard } from 'src/guards/refresh.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateAuthDto } from './dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refreshToken-user.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create SUPER_ADMIN with FullName, Email, Password ...',
  })
  @Post('/super-admin')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @ApiOperation({ summary: 'Register a new User with Email, Password ...' })
  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Veiry OTP with Email, OPT to Login' })
  @ApiOperation({ summary: 'Verify an OTP' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        otp: { type: 'string', example: '123456' },
      },
    },
  })
  @Post('/verify-otp')
  verifyOtp(@Body() body: { otp: string; email: string }) {
    return this.authService.verifyOtp(body.otp, body.email);
  }

  @ApiOperation({ summary: 'Loggin User with Email, Password' })
  @Post('/login')
  login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return this.authService.login(loginDto, req);
  }

  @ApiOperation({ summary: 'Get a new Access Token with Refresh Token' })
  @UseGuards(RefreshGuard)
  @Post('/refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto, @Req() req: Request) {
    return this.authService.refreshToken(req);
  }

  @ApiOperation({ summary: 'Get All Sessions' })
  @UseGuards(AuthGuard)
  @Get('/sessions')
  sessions(@Req() req: Request) {
    return this.authService.sessions(req);
  }

  @ApiOperation({ summary: 'Delete Sessions with IP, USERID' })
  @UseGuards(AuthGuard)
  @Delete('/sessions/:id')
  deleteSessions(@Req() req: Request, @Param('id') id: string) {
    return this.authService.deleteSessions(req, id);
  }

  @ApiOperation({ summary: 'Get MyData with Sessions' })
  @UseGuards(AuthGuard)
  @Get('/myData')
  myData(@Req() req: Request) {
    return this.authService.myData(req);
  }
}
