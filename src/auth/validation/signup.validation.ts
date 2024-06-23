import { Gender, Position } from "@prisma/client";
import { SignUpDTO } from "../dto/signup.dto";
import { BadRequestException } from "@nestjs/common";

export function validateSignUpDTO(dto: SignUpDTO) {
    const errors: string[] = [];

    // Validate name
    if (typeof dto.name !== 'string' || dto.name.trim() === '') {
        errors.push('Name must be a non-empty string.');
    }

    // Validate age
    const age = parseInt(dto.age, 10);
    if (isNaN(age) || age < 0 || age > 120) {
        errors.push('Age must be an integer between 0 and 120.');
    }

    // Validate birthday
    const birthday = new Date(dto.birthday);
    if (isNaN(birthday.getTime())) {
        errors.push('Birthday must be a valid date.');
    }

    // Validate location
    if (typeof dto.location !== 'string' || dto.location.trim() === '') {
        errors.push('Location must be a non-empty string.');
    }

    // Validate gender
    if (!Object.values(Gender).includes(dto.gender as Gender)) {
        errors.push('Gender must be a valid enum value.');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof dto.email !== 'string' || !emailRegex.test(dto.email)) {
        errors.push('Email must be a valid email address.');
    }

    // Validate contact
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 international phone number format
    if (typeof dto.contact !== 'string' || !phoneRegex.test(dto.contact)) {
        errors.push('Contact must be a valid phone number.');
    }

    // Validate picture (optional)
    if (dto.picture !== undefined) {
        const urlRegex = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
        if (typeof dto.picture !== 'string' || !urlRegex.test(dto.picture)) {
            errors.push('Picture must be a valid URL.');
        }
    }

    // Validate position (optional)
    if (dto.position !== undefined && !Object.values(Position).includes(dto.position as Position)) {
        errors.push('Position must be a valid enum value.');
    }

    if (errors.length > 0) {
        return new BadRequestException(errors.flatMap((error) => (error)));
    }
}
