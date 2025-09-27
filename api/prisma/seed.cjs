const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      title: 'T-Shirt Classic',
      price: 49.99,
      description: 'Bawełna 100%',
      imageUrl: 'https://picsum.photos/seed/p1/600',
    },
    {
      title: 'Hoodie Warm',
      price: 129.9,
      description: 'Miękka bluza',
      imageUrl: 'https://picsum.photos/seed/p2/600',
    },
    {
      title: 'Cap Logo',
      price: 39.0,
      description: 'Regulowana',
      imageUrl: 'https://picsum.photos/seed/p3/600',
    },
  ];
  for (const p of products) {
    await prisma.product.create({ data: p });
  }
}
main().finally(() => prisma.$disconnect());
