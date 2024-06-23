import { Controller, Get, Post, Put, Delete, Param, Body, Query, Res, UseGuards } from "@nestjs/common";
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { JwtGuard } from "src/auth/guards/auth.guard";


@ApiTags('blog')
@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new blog' })
    @ApiResponse({ status: 201, description: 'The blog has been successfully created.' })
    @ApiResponse({ status: 404, description: 'Author not found.' })
    async create(@Body() createBlogDto: CreateBlogDto, @Res() res) {
        const result = await this.blogService.create(createBlogDto);
        return res.status(result.status).json(result);
    }


    @Get()
    @ApiOperation({ summary: 'Find all blogs by region' })
    @ApiResponse({ status: 200, description: 'Blogs retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'No blogs found for the specified region.' })
    async findAllByRegion(@Query('region') region: string, @Res() res) {
        const result = await this.blogService.findAll(region);
        return res.status(result.status).json(result);
    }

    @Get("/all")
    @ApiOperation({ summary: 'Find all blogs' })
    @ApiResponse({ status: 200, description: 'Blogs retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'No blogs found for the specified region.' })
    async findAll(@Res() res) {
        const result = await this.blogService.findAll("");
        return res.status(result.status).json(result);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find a blog by ID' })
    @ApiResponse({ status: 200, description: 'Blog retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Blog not found.' })
    async findById(@Param('id') id: number, @Res() res) {
        const result = await this.blogService.findById(+id);
        return res.status(result.status).json(result);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a blog by ID' })
    @ApiResponse({ status: 200, description: 'Blog updated successfully.' })
    @ApiResponse({ status: 404, description: 'Blog not found.' })
    async update(@Param('id') id: number, @Body() updateBlogDto: UpdateBlogDto, @Res() res) {
        const result = await this.blogService.update(+id, updateBlogDto);
        return res.status(result.status).json(result);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a blog by ID' })
    @ApiResponse({ status: 200, description: 'Blog deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Blog not found.' })
    async delete(@Param('id') id: number, @Res() res) {
        const result = await this.blogService.delete(+id);
        return res.status(result.status).json(result);
    }
}
