import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiBadRequestResponse, ApiResponse } from '@nestjs/swagger';
import {
  BadLoginRequestResponse,
  InvalidEmailResponse,
  LoginSuccessfulResponse,
} from './login.response';
import {
  OtpSuccessfulResponse,
  InvalidOtpResponse,
  BadOtpRequestResponse,
} from './otp.response';
import {
  RefreshSuccessfulResponse,
  InvalidRefreshTokenResponse,
  BadRefreshRequestResponse,
} from './refresh.response';
import {
  UserCreatedResponse,
  UserAlreadyExistsResponse,
  SignupErrorResponse,
} from './signup.response'; // Ensure these paths are correct
import { SignUpDTO } from '../dto/signup.dto';


export const loginResponseDoc = () => {
  return applyDecorators(
    ApiResponse(LoginSuccessfulResponse),
    ApiResponse(InvalidEmailResponse),
    ApiBadRequestResponse(BadLoginRequestResponse),
  );
};

export const otpResponseDoc = () => {
  return applyDecorators(
    ApiResponse(OtpSuccessfulResponse),
    ApiResponse(InvalidOtpResponse),
    ApiBadRequestResponse(BadOtpRequestResponse),
  );
};

export const refreshResponseDoc = () => {
  return applyDecorators(
    ApiResponse(RefreshSuccessfulResponse),
    ApiResponse(InvalidRefreshTokenResponse),
    ApiBadRequestResponse(BadRefreshRequestResponse),
  );
};

export const signupResponseDoc = () => {
  return applyDecorators(
    ApiBody({ type: SignUpDTO }),
    ApiResponse(UserCreatedResponse),
    ApiResponse(UserAlreadyExistsResponse),
    ApiBadRequestResponse(SignupErrorResponse),
  );
};
