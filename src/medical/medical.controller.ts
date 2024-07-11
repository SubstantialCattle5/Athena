import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { MedicalService } from './medical.service';
import { CreateMedicalDto } from './dto/create-medical.dto';
import { AllExceptionsFilter } from 'src/custom-exception/custom-exception.filter';

@UseFilters(AllExceptionsFilter)
@Controller('medical')
export class MedicalController {
  constructor(private readonly medicalService: MedicalService) {}

  @Post()
  create(@Body() createMedicalDto: CreateMedicalDto) {
    return this.medicalService.create(createMedicalDto);
  }

  @Get()
  findAll() {
    return this.medicalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicalService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicalService.remove(+id);
  }
}
