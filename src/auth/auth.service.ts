import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { totp } from 'otplib';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import * as DeviceDetector from 'device-detector-js';
import { UserRole } from 'generated/prisma';
import { RegisterDto } from './dto/register.dto';
import { CreateAuthDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private deviceDetector = new DeviceDetector();

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

  async findUser(email: string) {
    try {
      return await this.prisma.users.findUnique({ where: { email } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async create(createUserDto: CreateAuthDto) {
    try {
      const checkAdmin = await this.prisma.users.findFirst({
        where: { role: UserRole.ADMIN },
      });

      if (checkAdmin)
        throw new ForbiddenException(
          `${checkAdmin.role} role already exists ❗`,
        );

      const checkUser = await this.findUser(createUserDto.email);

      if (checkUser)
        throw new ForbiddenException(
          `This ${checkUser.email} account already exists ❗`,
        );

      const checkRegion = await this.prisma.regions.findFirst({
        where: { id: createUserDto.regionId },
      });

      if (!checkRegion) throw new NotFoundException('Region not found ❗');

      const checkPhone = await this.prisma.users.findUnique({
        where: { phone: createUserDto.phone },
      });

      if (checkPhone)
        throw new BadRequestException(
          `This ${checkPhone.phone} PhoneNumber is already exists ❗`,
        );

      const hashPass = bcrypt.hashSync(createUserDto.password, 10);

      const newUser = await this.prisma.users.create({
        data: {
          ...createUserDto,
          password: hashPass,
          status: 'ACTIVE',
        },
      });

      return { newUser };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.findUser(registerDto.email);
      if (user)
        throw new BadRequestException(
          `This ${registerDto.email} account already exists ❗`,
        );

      const checkPhone = await this.prisma.users.findUnique({
        where: { phone: registerDto.phone },
      });

      if (checkPhone)
        throw new BadRequestException(`This PhoneNumber is already in use ❗`);

      const hashPass = bcrypt.hashSync(registerDto.password, 10);

      const data = {
        ...registerDto,
        password: hashPass,
      };

      await this.prisma.users.create({ data });

      totp.options = { digits: 6, step: 1800 };
      let otp = totp.generate(
        `${process.env.TOTP_SECKRET_KEY}_${registerDto.email}`,
      );

      await this.mailService.sendMail(
        registerDto.email,
        'One-Time Password',
        `This is an OTP to activate your account: <h1>${otp}</h1>`,
      );

      return {
        message:
          'Registered successfully ✅. We sent an OTP to your email, Please activate your account',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async verifyOtp(otp: string, email: string) {
    try {
      const user = await this.findUser(email);
      if (!user) throw new BadRequestException('Wrong Email ❗');

      const checkOtp = totp.verify({
        token: otp,
        secret: `${process.env.TOTP_SECKRET_KEY}_${email}`,
      });

      if (!checkOtp) throw new BadRequestException('Wrong OTP ❗');

      if (user.status == 'INACTIVE') {
        await this.prisma.users.update({
          data: { status: 'ACTIVE' },
          where: { email },
        });
      }

      return { message: 'Your account verified successfully ✅' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginDto, req: Request) {
    try {
      const user = await this.findUser(loginDto.email);
      if (!user) throw new ForbiddenException('Wrong Email ❗');

      const checkPass = bcrypt.compare(user.password, loginDto.password);
      if (!checkPass) throw new BadRequestException('Wrong Password ❗');

      const sessions = await this.prisma.sessions.findFirst({
        where: { userId: user.id, ipAdress: req.ip },
      });

      if (!sessions) {
        const useAgent: any = req.headers['user-agent'];
        const device: any = this.deviceDetector.parse(useAgent);

        const newSessions = {
          ipAdress: req.ip!,
          userId: user.id,
          deviceInfo: device,
        };

        await this.prisma.sessions.create({ data: newSessions });
      }

      let access_token = await this.generateAccessToken({
        id: user.id,
        role: user.role,
      });

      let refresh_token = await this.generateRefreshToken({
        id: user.id,
        role: user.role,
      });

      return { access_token, refresh_token };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async sessions(req: Request) {
    try {
      const id = req['user'].id;
      const user = await this.prisma.users.findFirst({ where: { id } });

      if (!user) throw new NotFoundException('User not found ❗');

      const Sessions = await this.prisma.sessions.findMany({
        where: { userId: id },
      });

      if (!Sessions.length) return { message: 'Sessions are empty' };

      return { Sessions };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteSessions(req: Request, id: string) {
    try {
      const findSession = await this.prisma.sessions.findFirst({
        where: { id },
      });

      if (!findSession) throw new NotFoundException('Session not found ❗');

      await this.prisma.sessions.delete({
        where: { id },
      });

      return { message: 'Session is successfully deleted ✅' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async myData(req: Request) {
    try {
      const id = req['user'].id;
      const user = await this.prisma.users.findFirst({ where: { id } });

      if (!user) throw new NotFoundException('User not found ❗');

      const checkSession = await this.prisma.sessions.findFirst({
        where: { ipAdress: req.ip, userId: user?.id },
      });

      if (!checkSession) throw new UnauthorizedException();

      return { user };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(req: Request) {
    let user = req['user'];
    try {
      const access_token = await this.generateAccessToken({
        id: user.id,
        role: user.role,
      });

      return { access_token };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async generateAccessToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '12h',
    });
  }

  async generateRefreshToken(payload: object) {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_KEY,
      expiresIn: '7d',
    });
  }
}
