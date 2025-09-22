import { z } from "zod";

export const CreateDocumentDtoSchema = z.object({
  objectId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  fileName: z.string().min(1).max(255),
  fileSize: z.number().positive(),
  mimeType: z.string().min(1).max(100),
});
export type CreateDocumentDto = z.infer<typeof CreateDocumentDtoSchema>;

export const UpdateDocumentDtoSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
});
export type UpdateDocumentDto = z.infer<typeof UpdateDocumentDtoSchema>;

export const PresignedUploadRequestSchema = z.object({
  fileName: z.string().min(1).max(255),
  fileSize: z.number().positive(),
  mimeType: z.string().min(1).max(100),
});
export type PresignedUploadRequest = z.infer<typeof PresignedUploadRequestSchema>;

export const PresignedUploadResponseSchema = z.object({
  uploadUrl: z.string().url(),
  fileKey: z.string(),
  fields: z.record(z.string()),
});
export type PresignedUploadResponse = z.infer<typeof PresignedUploadResponseSchema>;

export const DocumentMetadataSchema = z.object({
  fileKey: z.string(),
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string(),
});
export type DocumentMetadata = z.infer<typeof DocumentMetadataSchema>;