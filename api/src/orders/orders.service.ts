import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

function mapOrder(o: any) {
  return {
    _id: o.id,
    id: o.id,
    status: o.status,
    subtotal: Number(o.subtotal),
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    addressLine1: o.addressLine1,
    addressLine2: o.addressLine2,
    city: o.city,
    postalCode: o.postalCode,
    country: o.country,
    items: o.items?.map((it: any) => ({
      _id: it.id,
      id: it.id,
      productId: it.productId,
      title: it.title,
      price: Number(it.price),
      qty: it.qty,
      notes: it.notes,
    })),
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    if (!dto.items?.length) {
      throw new BadRequestException('Order must contain items');
    }

    const ids = dto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: ids } },
    });
    const priceMap = new Map(products.map((p) => [p.id, Number(p.price)]));

    let subtotal = 0;
    const itemsData = dto.items.map((i) => {
      const dbPrice = priceMap.get(i.productId);
      if (dbPrice == null) {
        throw new BadRequestException(`Product not found: ${i.productId}`);
      }
      subtotal += Number(dbPrice) * i.qty;
      return {
        productId: i.productId,
        title: i.title,
        price: Number(dbPrice),
        qty: i.qty,
        notes: i.notes,
      };
    });

    const order = await this.prisma.order.create({
      data: {
        status: 'PENDING',
        subtotal,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        postalCode: dto.postalCode,
        country: dto.country,
        items: { create: itemsData },
      },
      include: { items: true },
    });

    return mapOrder(order);
  }
}
