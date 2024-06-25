import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DateRangeDto } from './dto/date-range.dto';
import { PrismaService } from '../prisma/prisma.service';
import { calculatePercentageChange, millisecondsToReadableTime } from './util';

@Injectable()
export class AnalyticsService {

  constructor(private readonly prismaService: PrismaService) { }

  // Fetches all analytics data within a given date range
  async findAll(dateRange: DateRangeDto) {
    try {
      if (!dateRange.startDate || !dateRange.endDate) {
        throw new HttpException('Invalid date range', HttpStatus.BAD_REQUEST);
      }

      // Convert the dates to Date objects
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);

      if (endDate <= startDate) {
        throw new HttpException('End date must be after start date', HttpStatus.BAD_REQUEST);
      }

      // Calculate the previous date range
      const duration = endDate.getTime() - startDate.getTime();
      const previousStartDate = new Date(startDate.getTime() - duration);
      const previousEndDate = new Date(endDate.getTime() - duration);

      const [
        totalUsers,
        totalBlogs,
        uniqueLocation,
        queries,
        totalSurveys,
        previousTotalUsers,
        previousTotalBlogs,
        previousUniqueLocation,
        previousQueries,
        previousTotalSurveys
      ] = await Promise.all([
        this.prismaService.user.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
        this.prismaService.blog.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
        this.prismaService.user.groupBy({ by: ['location'], where: { createdAt: { gte: startDate, lte: endDate } } }),
        this.prismaService.medicalQuery.findMany({ orderBy: { createdAt: 'desc' }, where: { createdAt: { gte: startDate, lte: endDate } } }),
        this.prismaService.survey.count({ where: { createdAt: { gte: startDate, lte: endDate } } }),
        this.prismaService.user.count({ where: { createdAt: { gte: previousStartDate, lte: previousEndDate } } }),
        this.prismaService.blog.count({ where: { createdAt: { gte: previousStartDate, lte: previousEndDate } } }),
        this.prismaService.user.groupBy({ by: ['location'], where: { createdAt: { gte: previousStartDate, lte: previousEndDate } } }),
        this.prismaService.medicalQuery.findMany({ orderBy: { createdAt: 'desc' }, where: { createdAt: { gte: previousStartDate, lte: previousEndDate } } }),
        this.prismaService.survey.count({ where: { createdAt: { gte: previousStartDate, lte: previousEndDate } } })
      ]);

      const userChange = calculatePercentageChange(totalUsers, previousTotalUsers);
      const blogChange = calculatePercentageChange(totalBlogs, previousTotalBlogs);
      const locationChange = calculatePercentageChange(uniqueLocation.length, previousUniqueLocation.length);
      const queryChange = calculatePercentageChange(queries.length, previousQueries.length);
      const surveyChange = calculatePercentageChange(totalSurveys, previousTotalSurveys);

      return {
        status: '200',
        data: {
          currentPeriod: {
            totalUsers,
            totalBlogs,
            locations: uniqueLocation.length,
            questions: queries,
            totalSurveys
          },
          previousPeriod: {
            totalUsers: previousTotalUsers,
            totalBlogs: previousTotalBlogs,
            locations: previousUniqueLocation.length,
            questions: previousQueries,
            totalSurveys: previousTotalSurveys
          },
          changes: {
            userChange,
            blogChange,
            locationChange,
            queryChange,
            surveyChange
          },
          duration: millisecondsToReadableTime(duration)
        }
      };
    } catch (error) {
      throw (error);
    }
  }
}
