import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    try {
      const Users = await this.prisma.users.findMany();
      if (!Users.length) return { message: 'Users table are empty' };

      return { Users };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const User = await this.prisma.users.findFirst({ where: { id } });
      if (!User) throw new NotFoundException('User not found ❗');

      return { User };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const User = await this.prisma.users.findFirst({ where: { id } });
      if (!User) throw new NotFoundException('User not found ❗');

      const NewUsers = await this.prisma.users.update({
        data: updateUserDto,
        where: { id },
      });

      return { NewUsers };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const User = await this.prisma.users.findFirst({ where: { id } });
      if (!User) throw new NotFoundException('User not found ❗');

      await this.prisma.users.delete({ where: { id } });
      return { message: 'User is successfully deleted ✅' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
