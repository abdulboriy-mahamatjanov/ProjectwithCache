import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const { refreshToken } = request.body;

    if (!refreshToken) throw new UnauthorizedException('Unauthorized ❗');

    try {
      const data = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_KEY,
      });
      request['user'] = data;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized ❗');
    }
  }
}
