import { PrismaClient, Gender, Position } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  // Generate users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        age: faker.number.int({ min: 18, max: 70 }),
        birthday: faker.date.birthdate(),
        location: faker.location.city(),
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        email: faker.internet.email(),
        contact: faker.phone.number(),
        picture: faker.image.avatar(),
        position: faker.helpers.arrayElement(Object.values(Position)),
        language: faker.helpers.arrayElement(['english', 'tamil', 'hindi']),
      },
    });
    users.push(user);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
