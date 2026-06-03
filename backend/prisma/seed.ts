import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const empresa = await prisma.empresa.upsert({
    where: {
      rut: '11111111-1',
    },
    update: {},
    create: {
      nombre: 'DataIN',
      rut: '11111111-1',
    },
  });

  console.log('Empresa lista:', empresa);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });