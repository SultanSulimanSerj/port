import { z } from "zod";
import { UserRole, UuidSchema } from "./auth";

export const CreateCompanyDtoSchema = z.object({
  name: z.string().min(1).max(255),
  domain: z.string().optional(),
});
export type CreateCompanyDto = z.infer<typeof CreateCompanyDtoSchema>;

export const UpdateCompanyDtoSchema = CreateCompanyDtoSchema.partial();
export type UpdateCompanyDto = z.infer<typeof UpdateCompanyDtoSchema>;

export const InviteMemberDtoSchema = z.object({
  email: z.string().email(),
  role: UserRole,
});
export type InviteMemberDto = z.infer<typeof InviteMemberDtoSchema>;

export const UpdateMemberDtoSchema = z.object({
  role: UserRole,
  isActive: z.boolean().optional(),
});
export type UpdateMemberDto = z.infer<typeof UpdateMemberDtoSchema>;