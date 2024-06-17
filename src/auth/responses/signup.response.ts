import { ApiProperty } from '@nestjs/swagger';
import { Gender, Position } from '@prisma/client';

class UserCreatedInterface {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    age: number;

    @ApiProperty()
    birthday: Date;

    @ApiProperty()
    location: string;

    @ApiProperty()
    gender: Gender;

    @ApiProperty()
    email: string;

    @ApiProperty()
    contact: string;

    @ApiProperty()
    picture?: string;

    @ApiProperty()
    position?: Position;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

class UserAlreadyExistsInterface {
    @ApiProperty({ default: 'User already exists' })
    message: string;

    @ApiProperty({ default: 'User exist' })
    error: string;

    @ApiProperty({ default: 400 })
    statusCode: number;
}

class SignupErrorInterface {
    @ApiProperty({ default: 'An error occurred during signup' })
    message: string;

    @ApiProperty({ default: 'unknown error occured' })
    error: string;

    @ApiProperty({ default: 501 })
    statusCode: number;
}

export const UserCreatedResponse = {
    description: 'User created successfully',
    type: UserCreatedInterface,
    status: 201,
};

export const UserAlreadyExistsResponse = {
    description: 'User already exists',
    type: UserAlreadyExistsInterface,
    status: 400,
};

export const SignupErrorResponse = {
    description: 'An error occurred during signup',
    type: SignupErrorInterface,
    status: 501,
};
