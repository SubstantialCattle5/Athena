// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service'; // Ensure PrismaService is also provided if used

@Module({
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
