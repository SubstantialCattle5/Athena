import { Injectable, Logger } from '@nestjs/common';
import { DateRangeDto } from './dto/date-range.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prismaService: PrismaService) { }

  // Fetches all analytics data within a given date range
  async findAll(dateRange: DateRangeDto) {
    try {
      if (!dateRange.startDate || !dateRange.endDate) {
        throw new Error('Invalid date range');
      }

      const { startDate, endDate } = dateRange;
      // Total users 
      const totalUsers = await this.prismaService.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      // Total blogs 
      const totalBlogs = await this.prismaService.blog.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      });

      // Total regions 
      const uniqueLocation = await this.prismaService.user.groupBy({
        by: "location"
      });

      const queries = await this.prismaService.medicalQuery.findMany({
        orderBy: {
          createdAt: "desc"
        }
      });

      return {
        status: "200",
        data: {
          totalUsers: totalUsers,
          totalBlogs: totalBlogs,
          locations: uniqueLocation.length,
          questions: queries
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
