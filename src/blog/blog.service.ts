import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
@ApiTags('blogs')
export class BlogService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new blog entry
   * @param createBlogDto - Data transfer object containing blog details
   * @returns Created blog entry or error response
   */
  @ApiResponse({
    status: 201,
    description: 'The blog has been successfully created.',
  })
  @ApiResponse({ status: 404, description: 'Author not found.' })
  async create(createBlogDto: CreateBlogDto) {
    const { title, region, pic, content, authorId, language } = createBlogDto;

    // Find the author's name using their ID
    const author = await this.prismaService.user.findUnique({
      where: { id: authorId },
      select: { name: true },
    });

    // Check if the author exists
    if (!author) {
      return { status: 404, message: 'Author not found' };
    }

    // Create a new blog entry
    const blog = await this.prismaService.blog.create({
      data: {
        title,
        region,
        picture: pic,
        content,
        authorName: author.name,
        language,
      },
    });

    return { status: 201, data: blog };
  }

  /**
   * Find all blogs by region
   * @param region - Region to filter blogs
   * @returns List of blogs or error response
   */
  @ApiResponse({ status: 200, description: 'Blogs retrieved successfully.' })
  @ApiResponse({
    status: 404,
    description: 'No blogs found for the specified region.',
  })
  async findAll(region: string) {
    if (region === '') {
      return {
        status: 200,
        data: await this.prismaService.blog.findMany(),
      };
    }
    const blogs = await this.prismaService.blog.findMany({
      where: { region },
    });

    if (!blogs.length) {
      return {
        status: 404,
        message: 'No blogs found for the specified region',
      };
    }

    return { status: 200, data: blogs };
  }

  /**
   * Find all blogs by language
   * @param language - Language to filter blogs
   * @returns List of blogs or error response
   */
  @ApiResponse({ status: 200, description: 'Blogs retrieved successfully.' })
  @ApiResponse({
    status: 404,
    description: 'No blogs found for the specified region.',
  })
  async findAllByLang(language: string) {
    if (language === '') {
      return {
        status: 200,
        data: await this.prismaService.blog.findMany(),
      };
    }
    const blogs = await this.prismaService.blog.findMany({
      where: { language },
    });

    if (!blogs.length) {
      return {
        status: 404,
        message: 'No blogs found for the specified region',
      };
    }

    return { status: 200, data: blogs };
  }

  /**
   * Find a blog by ID
   * @param id - ID of the blog to retrieve
   * @returns Blog entry or error response
   */
  @ApiResponse({ status: 200, description: 'Blog retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  async findById(id: number) {
    const blog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return { status: 404, message: 'Blog not found' };
    }

    return { status: 200, data: blog };
  }

  /**
   * Update a blog's details
   * @param id - ID of the blog to update
   * @param updateBlogDto - Data transfer object containing updated blog details
   * @returns Updated blog entry or error response
   */
  @ApiResponse({ status: 200, description: 'Blog updated successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const { title, region, pic, content } = updateBlogDto;

    const existingBlog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return { status: 404, message: 'Blog not found' };
    }

    const updatedBlog = await this.prismaService.blog.update({
      where: { id },
      data: { title, region, picture: pic, content },
    });

    return { status: 200, data: updatedBlog };
  }

  /**
   * Delete a blog by ID
   * @param id - ID of the blog to delete
   * @returns Success message or error response
   */
  @ApiResponse({ status: 200, description: 'Blog deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  async delete(id: number) {
    const existingBlog = await this.prismaService.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return { status: 404, message: 'Blog not found' };
    }

    await this.prismaService.blog.delete({
      where: { id },
    });

    return { status: 200, message: 'Blog deleted successfully' };
  }
}
