// Default numbering masks
export const DEFAULT_NUMBERING_MASKS = {
  PROPOSAL: 'PROP-{YYYY}-{SEQ:4}',
  CONTRACT: 'CON-{YYYY}-{SEQ:4}',
  KS2: 'KS2-{YYYY}-{SEQ:3}',
  KS3: 'KS3-{YYYY}-{SEQ:3}',
  WORK_ACT: 'ACT-{YYYY}-{SEQ:4}',
  UPD: 'UPD-{YYYY}-{SEQ:4}',
} as const;

// File size limits (in bytes)
export const FILE_LIMITS = {
  DOCUMENT_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  IMAGE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
} as const;

// Supported file types
export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
] as const;

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// JWT token expiration
export const JWT_EXPIRATION = {
  ACCESS_TOKEN: '15m',
  REFRESH_TOKEN: '7d',
  INVITATION_TOKEN: '24h',
} as const;