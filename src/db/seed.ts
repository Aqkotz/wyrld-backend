import bcrypt from 'bcrypt';
import { UserRole, PrismaClient } from '@prisma/client';
import { HASH_ROUNDS } from 'util/constants';

const prisma = new PrismaClient();

async function main() {

  /**
   * User Data
   */
  const users = [
    {
      email: 'unverified@gmail.com',
      password: await bcrypt.hash('12345', HASH_ROUNDS),
      name: 'Unverified',
      role: UserRole.UNVERIFIED,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: 'user@gmail.com',
      password: await bcrypt.hash('12345', HASH_ROUNDS),
      name: 'User',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: 'admin@gmail.com',
      password: await bcrypt.hash('12345', HASH_ROUNDS),
      name: 'Admin',
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await Promise.all(
    users.map(async (user) => {
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            ...user,
          },
          create: {
            ...user,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }));

  /**
  * Resource Data
  */
  const resources = [
    {
      title: 'The Grapes of Wrath',
      description: 'John Steinbeck',
      value: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'The Great Gatsby',
      description: 'F. Scott Fitzgerald',
      value: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Macbeth',
      description: 'William Shakespeare',
      value: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Heart of Darkness',
      description: 'Joseph Conrad',
      value: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  const resourceIds: string[] = [];
  await Promise.all(
    resources.map(async (resource) => {
      try {
        const res = await prisma.resource.create({
          data: {
            ...resource,
          },
        });
        resourceIds.push(res.id);
      } catch (e) {
        console.log(e);
      }
    }));

  /**
    * Item Data
    */
  const items = [
    {
      resourceId: resourceIds[0],
      name: 'Item Name A',
      description: 'Description Name A',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      resourceId: resourceIds[1],
      name: 'Item Name B',
      description: 'Description Name B',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await Promise.all(
    items.map(async (item) => {
      try {
        await prisma.item.create({
          data: {
            ...item,
          },
        });
      } catch (e) {
        console.log(e);
      }
    }));
  console.log('Seeding done');
  process.exit(0);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });