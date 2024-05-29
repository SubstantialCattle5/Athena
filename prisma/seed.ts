import { PrismaClient, Gender, Position, TaskStatus, SleepType, AnswerType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const genders = [Gender.MALE, Gender.FEMALE, Gender.OTHER];
  const positions = [Position.SUPERVISOR, Position.EMPLOYEE];
  const taskStatuses = [TaskStatus.UPCOMING, TaskStatus.COMPLETED, TaskStatus.CANCELED];
  const sleepTypes = [SleepType.TODAY, SleepType.WEEKLY, SleepType.MONTHLY];
  const answerTypes = [AnswerType.PLAIN_TEXT, AnswerType.DROPDOWN];

  const users = [];
  const blogs = [];
  const tasks = [];
  const sleepData = [];
  const surveys = [];
  const questions = [];

// Generate 100 users
for (let i = 0; i < 100; i++) {
    users.push(
      prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          age: 20 + (i % 50),
          birthday: new Date(`1990-01-${(i % 30) + 1}`),
          location: `Location ${i + 1}`,
          gender: genders[i % genders.length],
          email: `user${i + 1}@example${i}.com`, // Unique email address
          contact: `123456789${i % 10}`,
          picture: `https://example.com/user${i + 1}.jpg`,
          position: positions[i % positions.length],
        },
      })
    );
  }
  

  // Create users
  await Promise.all(users);

  // Get all users
  const createdUsers = await prisma.user.findMany();

  // Generate 100 blogs
  for (let i = 0; i < 100; i++) {
    blogs.push(
      prisma.blog.create({
        data: {
          title: `Blog Post ${i + 1}`,
          pic: `https://example.com/blog${i + 1}.jpg`,
          content: `This is the content of blog post ${i + 1}.`,
          authorName: createdUsers[i % createdUsers.length].name,
          user: { connect: { id: createdUsers[i % createdUsers.length].id } },
        },
      })
    );
  }

  // Generate 100 tasks
  for (let i = 0; i < 100; i++) {
    tasks.push(
      prisma.task.create({
        data: {
          date: new Date(),
          taskName: `Task ${i + 1}`,
          status: taskStatuses[i % taskStatuses.length],
          user: { connect: { id: createdUsers[(i + 1) % createdUsers.length].id } },
          issuedBy: { connect: { id: createdUsers[i % createdUsers.length].id } },
        },
      })
    );
  }

  // Generate 100 sleep data entries
  for (let i = 0; i < 100; i++) {
    const sleepStart = new Date();
    sleepStart.setHours(22, 0, 0, 0);
    sleepStart.setDate(sleepStart.getDate() + i);

    const sleepEnd = new Date(sleepStart);
    sleepEnd.setHours(6, 0, 0, 0);
    sleepEnd.setDate(sleepStart.getDate() + 1);

    sleepData.push(
      prisma.sleepData.create({
        data: {
          date: new Date(),
          sleepStart: sleepStart,
          sleepEnd: sleepEnd,
          sleepType: sleepTypes[i % sleepTypes.length],
          user: { connect: { id: createdUsers[i % createdUsers.length].id } },
        },
      })
    );
  }

  // Generate 100 surveys and 2 questions for each survey
  for (let i = 0; i < 100; i++) {
    const survey = await prisma.survey.create({
      data: {
        title: `Survey ${i + 1}`,
        description: `Description for survey ${i + 1}`,
        user: { connect: { id: createdUsers[i % createdUsers.length].id } },
      },
    });

    questions.push(
      prisma.question.create({
        data: {
          question: `How satisfied are you with your job? ${i + 1}`,
          answerType: AnswerType.DROPDOWN,
          options: JSON.stringify(['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied']),
          correctAnswer: null,
          survey: { connect: { id: survey.id } },
        },
      })
    );

    questions.push(
      prisma.question.create({
        data: {
          question: `What can be improved? ${i + 1}`,
          answerType: AnswerType.PLAIN_TEXT,
          options: null,
          correctAnswer: null,
          survey: { connect: { id: survey.id } },
        },
      })
    );
  }

  // Create blogs, tasks, sleep data, and questions
  await Promise.all(blogs);
  await Promise.all(tasks);
  await Promise.all(sleepData);
  await Promise.all(questions);
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
