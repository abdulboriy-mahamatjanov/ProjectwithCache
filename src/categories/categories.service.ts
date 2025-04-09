import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const NewCategories = await this.prisma.categories.create({
        data: createCategoryDto,
      });

      return { NewCategories };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const Categories = await this.prisma.categories.findMany({
        include: { Products: true },
      });

      if (!Categories.length) return { message: 'Categories table are empty' };

      return { Categories };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const Category = await this.prisma.categories.findFirst({
        where: { id },
        include: { Products: true },
      });

      if (!Category) throw new NotFoundException('Category not found ❗');

      return { Category };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const Category = await this.prisma.categories.findFirst({
        where: { id },
      });

      if (!Category) throw new NotFoundException('Category not found ❗');

      const NewCategories = await this.prisma.categories.update({
        data: updateCategoryDto,
        where: { id },
      });

      return { NewCategories };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const Category = await this.prisma.categories.findFirst({
        where: { id },
      });

      if (!Category) throw new NotFoundException('Category not found ❗');

      await this.prisma.categories.delete({ where: { id } });
      return { messsage: 'Category is successfully deleted ✅' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
