import { Injectable, Logger } from '@nestjs/common';
import { DateRangeDto } from './dto/date-range.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prismaService: PrismaService) { }

  // Fetches all analytics data within a given date range
  async findAll(dateRange: DateRangeDto) {
    console.log(dateRange)
    try {
      if (!dateRange.startDate || !dateRange.endDate) {
        throw new Error('Invalid date range');
      }

      // Convert the dates to Date objects
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);

      // Calculate the previous date range
      const duration = endDate.getTime() - startDate.getTime();
      const previousStartDate = new Date(startDate.getTime() - duration);
      const previousEndDate = new Date(endDate.getTime() - duration);

      // Fetch current period data
      const totalUsers = await this.prismaService.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      const totalBlogs = await this.prismaService.blog.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      const uniqueLocation = await this.prismaService.user.groupBy({
        by: ["location"],
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      const queries = await this.prismaService.medicalQuery.findMany({
        orderBy: {
          createdAt: "desc"
        },
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      // Fetch previous period data
      const previousTotalUsers = await this.prismaService.user.count({
        where: {
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate
          }
        }
      });

      const previousTotalBlogs = await this.prismaService.blog.count({
        where: {
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate
          }
        }
      });

      const previousUniqueLocation = await this.prismaService.user.groupBy({
        by: ["location"],
        where: {
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate
          }
        }
      });

      const previousQueries = await this.prismaService.medicalQuery.findMany({
        orderBy: {
          createdAt: "desc"
        },
        where: {
          createdAt: {
            gte: previousStartDate,
            lte: previousEndDate
          }
        }
      });

      // Calculate percentage changes
      const calculatePercentageChange = (current: number, previous: number): string => {
        if (previous === 0) {
          return current > 0 ? '+100%' : '+0%';
        }
        const change = ((current - previous) / previous) * 100;
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(2)}%`;
      };

      const userChange = calculatePercentageChange(totalUsers, previousTotalUsers);
      const blogChange = calculatePercentageChange(totalBlogs, previousTotalBlogs);
      const locationChange = calculatePercentageChange(uniqueLocation?.length, previousUniqueLocation?.length);
      const queryChange = calculatePercentageChange(queries?.length, previousQueries?.length);

      return {
        status: "200",
        data: {
          currentPeriod: {
            totalUsers: totalUsers,
            totalBlogs: totalBlogs,
            locations: uniqueLocation?.length,
            questions: queries
          },
          previousPeriod: {
            totalUsers: previousTotalUsers,
            totalBlogs: previousTotalBlogs,
            locations: previousUniqueLocation?.length,
            questions: previousQueries
          },
          changes: {
            userChange,
            blogChange,
            locationChange,
            queryChange
          },
          duration: millisecondsToReadableTime(duration)
        }
      };
    } catch (error) {
      this.logger.error(`Failed to fetch analytics data: ${(error as any).message}`);
      throw new Error('Error fetching analytics data');
    }
  }

  // Fetches analytics data for a specific id
  findOne(id: number) {
    if (typeof id !== 'number') {
      this.logger.error(`Invalid id: ${id}`);
      throw new Error('Invalid id');
    }
    return `This action returns a #${id} analytics`;
  }
}

function millisecondsToReadableTime(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30); // Rough approximation
  const years = Math.floor(months / 12);

  const readableTime = {
    years: years,
    months: months % 12,
    days: days % 30,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60
  };

  return readableTime;
}