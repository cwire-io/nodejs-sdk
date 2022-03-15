import { PrismaClient } from '@prisma/client';
import { CWire, PrismaDataModel } from '../../';

const prisma = new PrismaClient();

async function main() {
  await Promise.all([
    prisma.user.create({
      data: {
        name: 'Christoph',
        email: 'christoph.abs@cwire.io',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Example',
        email: 'example@example.co',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Local',
        email: 'local@host.de',
      },
    }),
  ]);

  await CWire.init('<YOUR_API_KEY>', {
    logger: 'debug',
    models: PrismaDataModel.parse(prisma, {}),
  });
}

main();
