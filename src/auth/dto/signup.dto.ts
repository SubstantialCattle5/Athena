import { ApiProperty } from '@nestjs/swagger';
import { Gender, Position } from '@prisma/client';


export class SignUpDTO {
    @ApiProperty({ description: 'The name of the user' })
    name: string;

    @ApiProperty({ description: 'The age of the user' })
    age: string;

    @ApiProperty({ description: 'The birthday of the user', type: String, format: 'date-time' })
    birthday: Date;

    @ApiProperty({ description: 'The location of the user' })
    location: string;

    @ApiProperty({ description: 'The gender of the user', enum: Gender })
    gender: Gender;

    @ApiProperty({ description: 'The email address of the user' })
    email: string;

    @ApiProperty({ description: 'The contact number of the user' })
    contact: string;

    @ApiProperty({ description: 'The picture URL of the user', required: false })
    picture?: string;

    @ApiProperty({ description: 'The position of the user', enum: Position, required: false })
    position?: Position;
}

