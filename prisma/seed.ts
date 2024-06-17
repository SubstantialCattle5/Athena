import { PrismaClient, Gender, Position, TaskStatus, SleepType, QuestionType, QueryStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();

  // Generate users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        name: faker.name.fullName(),
        age: faker.datatype.number({ min: 18, max: 70 }),
        birthday: faker.date.past(50, new Date('2000-01-01')),
        location: faker.address.city(),
        gender: faker.helpers.arrayElement(Object.values(Gender)),
        email: faker.internet.email(),
        contact: faker.phone.number('##########'),
        picture: faker.image.avatar(),
        position: faker.helpers.arrayElement(Object.values(Position)),
      },
    });
    users.push(user);
  }

  // Generate blogs
  for (const user of users) {
    for (let i = 0; i < 3; i++) {
      await prisma.blog.create({
        data: {
          title: faker.lorem.sentence(),
          picture: faker.image.imageUrl(),
          content: faker.lorem.paragraphs(3),
          authorName: user.name,
          userId: user.id,
          region: faker.helpers.arrayElement(['general', 'tech', 'health', 'travel']),
        },
      });
    }
  }

  // Generate tasks
  for (const user of users) {
    for (let i = 0; i < 3; i++) {
      await prisma.task.create({
        data: {
          date: faker.date.future(),
          taskName: faker.lorem.words(3),
          status: faker.helpers.arrayElement(Object.values(TaskStatus)),
          userId: user.id,
          issuedById: faker.helpers.arrayElement(users).id,
        },
      });
    }
  }

  // Generate sleep data
  for (const user of users) {
    for (let i = 0; i < 3; i++) {
      await prisma.sleepData.create({
        data: {
          date: faker.date.past(),
          sleepStart: faker.date.past(),
          sleepEnd: faker.date.past(),
          sleepType: faker.helpers.arrayElement(Object.values(SleepType)),
          userId: user.id,
        },
      });
    }
  }

  // Generate surveys and questions
  for (const user of users) {
    for (let i = 0; i < 2; i++) {
      const survey = await prisma.survey.create({
        data: {
          topic: faker.lorem.words(3),
          description: faker.lorem.paragraphs(2),
          userId: user.id,
        },
      });

      for (let j = 0; j < 5; j++) {
        const question = await prisma.question.create({
          data: {
            text: faker.lorem.sentence(),
            type: faker.helpers.arrayElement(Object.values(QuestionType)),
            correctAnswer: faker.lorem.sentence(),
            surveyId: survey.id,
          },
        });

        // Generate answers
        for (const user of users) {
          await prisma.answer.create({
            data: {
              response: faker.lorem.sentence(),
              userId: user.id,
              questionId: question.id,
            },
          });
        }
      }
    }
  }

  // Generate medical queries
  for (const user of users) {
    for (let i = 0; i < 1; i++) {
      await prisma.medicalQuery.create({
        data: {
          query: faker.lorem.paragraph(),
          response: faker.lorem.paragraph(),
          status: faker.helpers.arrayElement(Object.values(QueryStatus)),
          userId: user.id,
        },
      });
    }
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
