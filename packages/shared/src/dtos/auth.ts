import { z } from 'zod';
import { UserRole } from '../types';

export const LoginRequestSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

export const RegisterRequestSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  companyName: z.string().min(1, 'Название компании обязательно'),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

export const InviteUserRequestSchema = z.object({
  email: z.string().email('Неверный формат email'),
  role: z.nativeEnum(UserRole),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const AcceptInviteRequestSchema = z.object({
  token: z.string(),
  password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
});

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
export type InviteUserRequest = z.infer<typeof InviteUserRequestSchema>;
export type AcceptInviteRequest = z.infer<typeof AcceptInviteRequestSchema>;
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;