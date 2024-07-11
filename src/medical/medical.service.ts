import { Injectable } from '@nestjs/common';
import { CreateMedicalDto } from './dto/create-medical.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MedicalService {
  constructor(private readonly prismaService: PrismaService) { }

  async create(createMedicalDto: CreateMedicalDto) {
    const { query, answer } = createMedicalDto;
    try {
      const response = await this.prismaService.medicalQuery.create({
        data: {
          query: query,
          response: answer
        }
      })
      return response
    }
    catch (error) {
      throw (error)
    }
    return 'This action adds a new medical';
  }

  findAll() {
    return `This action returns all medical`;
  }

  findOne(id: number) {
    return `This action returns a #${id} medical`;
  }


  remove(id: number) {
    return `This action removes a #${id} medical`;
  }
}
