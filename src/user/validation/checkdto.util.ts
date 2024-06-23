import { BadRequestException } from "@nestjs/common";
import { CreateUserDto } from "../dto/CreateUser.dto";
import { isValidEmail } from "./validEmail.util";


// Validation function for CreateUserDto
export const checkDto = (createUserDto: CreateUserDto): void => {
  // Validate email format
  if (!isValidEmail(createUserDto.email)) {
    throw new BadRequestException(['Invalid email format']);
  }

  // Validate name (assuming it's a string and required)
  if (!createUserDto.name || typeof createUserDto.name !== 'string') {
    throw new BadRequestException(['Name is required and must be a string']);
  }

  // Validate birthday (assuming it's a Date object and required)
  if (!createUserDto.birthday) {
    throw new BadRequestException(['Birthday is required and must be a valid Date']);
  }

  // Validate location (assuming it's a string and required)
  if (!createUserDto.location || typeof createUserDto.location !== 'string') {
    throw new BadRequestException(['Location is required and must be a string']);
  }

  // Validate gender (assuming it's a string and required)
  if (!createUserDto.gender || typeof createUserDto.gender !== 'string') {
    throw new BadRequestException(['Gender is required and must be a string']);
  }

  // Validate contact (assuming it's a string and required)
  if (!createUserDto.contact || typeof createUserDto.contact !== 'string') {
    throw new BadRequestException(['Contact is required and must be a string']);
  }
};
