import { PrismaClient, Gender, Position, TaskStatus, SleepType } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 100; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.fullName().slice(0, 100),  // Ensure name is at most 100 characters
        age: faker.datatype.number({ min: 18, max: 80 }),
        birthday: faker.date.past(50, new Date('2002-01-01')),
        location: faker.address.city().slice(0, 255),  // Ensure location is at most 255 characters
        gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
        email: faker.internet.email().slice(0, 255),  // Ensure email is at most 255 characters
        contact: faker.phone.number().slice(0, 20),  // Ensure contact is at most 20 characters
        picture: faker.image.avatar().slice(0, 255),  // Ensure picture URL is at most 255 characters
        position: faker.helpers.arrayElement([Position.SUPERVISOR, Position.EMPLOYEE, Position.USER]),
        blogs: {
          create: [
            {
              title: faker.lorem.sentence().slice(0, 255),  // Ensure title is at most 255 characters
              pic: faker.image.imageUrl().slice(0, 255),  // Ensure picture URL is at most 255 characters
              content: faker.lorem.paragraphs(3),
              authorName: faker.name.fullName().slice(0, 100),  // Ensure author name is at most 100 characters
            },
          ],
        },
        tasks: {
          create: [
            {
              date: faker.date.future(),
              taskName: faker.lorem.words(3).slice(0, 255),  // Ensure task name is at most 255 characters
              status: faker.helpers.arrayElement([TaskStatus.UPCOMING, TaskStatus.COMPLETED, TaskStatus.CANCELED]),
            },
          ],
        },
        sleepData: {
          create: [
            {
              date: faker.date.recent(),
              sleepStart: faker.date.recent(),
              sleepEnd: faker.date.recent(),
              sleepType: faker.helpers.arrayElement([SleepType.TODAY, SleepType.WEEKLY, SleepType.MONTHLY]),
            },
          ],
        },
        surveys: {
          create: [
            {
              topic: faker.lorem.word().slice(0, 255),  // Ensure topic is at most 255 characters
              description: faker.lorem.paragraph(),
            },
          ],
        },
      },
    });

    console.log(`Created user with id: ${user.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
