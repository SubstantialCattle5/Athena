// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GoogleUserDto } from 'src/auth/dto/google-user-dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prismaService.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      where: { position: 'USER' },
    });
  }

  async findOne(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    return await this.prismaService.user.update({
      where: { email },
      data: updateUserDto,
    });
  }

  async remove(email: string) {
    return await this.prismaService.user.delete({
      where: { email },
    });
  }

  async loginWithGoogle(googleUserDto: GoogleUserDto) {
    const { email, given_name, family_name, picture } = googleUserDto;
    let user = await this.prismaService.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          name: `${given_name} ${family_name}`,
          email: email,
          picture: picture,
          position: 'USER', // Default position
          age: 18,
          birthday: new Date('2002-12-21'), // Correct date format
          location: 'Mumbai',
          gender: 'MALE',
          contact:"number"
        },
      });
    } else {
      user = await this.prismaService.user.update({
        where: { email },
        data: {
          name: `${given_name} ${family_name}`,
          picture: picture,
        },
      });
    }

    return user;
  }
}



//! BLOGS - just send em back based 