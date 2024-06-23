import { LoginDto } from "../dto/login.dto";

function loginValidation(dto: LoginDto): string[] {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof dto.email !== 'string' || !emailRegex.test(dto.email)) {
        errors.push('Email must be a valid email address.');
    }

    return errors;
}

export {loginValidation} ; 