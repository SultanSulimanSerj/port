import { z } from "zod";

export const UserRole = z.enum(["OWNER", "ADMIN", "PM", "WORKER", "VIEWER"]);
export type UserRole = z.infer<typeof UserRole>;

export const JwtPayloadSchema = z.object({
  sub: z.string().uuid(),
  company_id: z.string().uuid(),
  roles: z.array(UserRole),
  iat: z.number().optional(),
  exp: z.number().optional(),
});
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;

export const LoginDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginDto = z.infer<typeof LoginDtoSchema>;

export const RegisterDtoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().min(1),
});
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

export const RefreshTokenDtoSchema = z.object({
  refreshToken: z.string(),
});
export type RefreshTokenDto = z.infer<typeof RefreshTokenDtoSchema>;