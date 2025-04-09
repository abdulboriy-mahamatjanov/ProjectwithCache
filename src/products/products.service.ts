import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const NewProducts = await this.prisma.products.create({
        data: createProductDto,
      });

      return { NewProducts };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      const Products = await this.prisma.products.findMany({
        include: { category: true },
      });
      if (!Products.length) return { message: 'Products table empty' };

      return { Products };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const Product = await this.prisma.products.findFirst({
        where: { id },
        include: { category: true },
      });
      if (!Product) throw new NotFoundException('Product not found ❗');

      return { Product };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const Product = await this.prisma.products.findFirst({ where: { id } });
      if (!Product) throw new NotFoundException('Product not found ❗');

      const NewProducts = await this.prisma.products.update({
        data: updateProductDto,
        where: { id },
      });

      return { NewProducts };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      const Product = await this.prisma.products.findFirst({ where: { id } });
      if (!Product) throw new NotFoundException('Product not found ❗');

      await this.prisma.products.delete({ where: { id } });
      return { message: 'Product is successfully deleted ✅' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
