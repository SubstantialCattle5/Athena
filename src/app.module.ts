import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';


@Module({
  imports: [PrismaModule, AuthModule, UserModule,BlogModule],
})
export class AppModule {}
