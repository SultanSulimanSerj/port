import { z } from "zod";

export const ObjectRole = z.enum(["LEAD", "ENGINEER", "SUPERVISOR", "VIEWER"]);
export type ObjectRole = z.infer<typeof ObjectRole>;

export const ObjectStatus = z.enum([
  "DRAFT",
  "ACTIVE", 
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED"
]);
export type ObjectStatus = z.infer<typeof ObjectStatus>;

export const CreateObjectDtoSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  status: ObjectStatus.default("DRAFT"),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
  currency: z.enum(["USD", "EUR", "RUB"]).default("USD"),
});
export type CreateObjectDto = z.infer<typeof CreateObjectDtoSchema>;

export const UpdateObjectDtoSchema = CreateObjectDtoSchema.partial();
export type UpdateObjectDto = z.infer<typeof UpdateObjectDtoSchema>;

export const AddObjectMemberDtoSchema = z.object({
  userId: z.string().uuid(),
  role: ObjectRole,
  isResponsible: z.boolean().default(false),
});
export type AddObjectMemberDto = z.infer<typeof AddObjectMemberDtoSchema>;

export const UpdateObjectMemberDtoSchema = z.object({
  role: ObjectRole.optional(),
  isResponsible: z.boolean().optional(),
});
export type UpdateObjectMemberDto = z.infer<typeof UpdateObjectMemberDtoSchema>;