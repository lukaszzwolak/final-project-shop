import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

function mapProduct(p: any) {
  return {
    _id: p.id,
    id: p.id,
    title: p.title,
    price: Number(p.price),
    description: p.description,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const list = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return list.map(mapProduct);
  }

  async findOne(id: string) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Product not found');
    return mapProduct(p);
  }

  async create(dto: CreateProductDto) {
    const p = await this.prisma.product.create({ data: dto as any });
    return mapProduct(p);
  }

  async update(id: string, dto: UpdateProductDto) {
    const p = await this.prisma.product.update({
      where: { id },
      data: dto as any,
    });
    return mapProduct(p);
  }

  async delete(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { ok: true };
  }
}
