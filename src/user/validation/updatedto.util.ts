import { BadRequestException } from "@nestjs/common";
import { UpdateUserDto } from "../dto/update-user.dto";
import { isValidEmail } from "./validEmail.util";

// Validation function for UpdateUserDto
export const checkUpdateDto = (updateUserDto: UpdateUserDto): void => {
    // Validate name (if provided, assuming it's a string)
    if (updateUserDto.name !== undefined && typeof updateUserDto.name !== 'string') {
      throw new BadRequestException(['The name should be of type string']);
    }
  
    // Validate email (if provided, assuming it's a string and valid format)
    if (updateUserDto.email !== undefined && (!isValidEmail(updateUserDto.email) || typeof updateUserDto.email !== 'string')) {
      throw new BadRequestException(['Invalid email format']);
    }
  
    // Validate birthday (if provided, assuming it's a Date object)
    if (updateUserDto.birthday !== undefined) {
      throw new BadRequestException(['Birthday must be a valid Date']);
    }
  
    // Validate location (if provided, assuming it's a string)
    if (updateUserDto.location !== undefined && typeof updateUserDto.location !== 'string') {
      throw new BadRequestException(['Location must be a string']);
    }
  
    // Validate gender (if provided, assuming it's a string)
    if (updateUserDto.gender !== undefined && typeof updateUserDto.gender !== 'string' ) {
      throw new BadRequestException(['Gender must be a string']);
    }
  
    // Validate contact (if provided, assuming it's a string)
    if (updateUserDto.contact !== undefined && typeof updateUserDto.contact !== 'string') {
      throw new BadRequestException(['Contact must be a string']);
    }
  };
  