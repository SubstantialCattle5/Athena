import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { DateRangeDto } from './dto/date-range.dto';
import { AllExceptionsFilter } from 'src/custom-exception/custom-exception.filter';

@UseFilters(AllExceptionsFilter)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Post()
  findAll(@Body() dateRangeDto: DateRangeDto) {
    return this.analyticsService.findAll(dateRangeDto);
  }


}
