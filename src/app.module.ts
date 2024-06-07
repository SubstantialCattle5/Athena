import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { SurveyModule } from './survey/survey.module';
import { TasksModule } from './tasks/tasks.module';


@Module({
  imports: [PrismaModule, AuthModule, UserModule,BlogModule, SurveyModule, TasksModule],
})
export class AppModule {}
