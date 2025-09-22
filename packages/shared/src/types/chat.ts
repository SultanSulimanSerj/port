import { UUID, Timestamp } from './index';

export interface ChatThread {
  id: UUID;
  companyId: UUID;
  objectId: UUID;
  title: string;
  isDefault: boolean;
  lastMessageAt?: Timestamp;
  messageCount: number;
  createdById: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatMessage {
  id: UUID;
  threadId: UUID;
  authorId: UUID;
  text: string;
  attachments?: {
    name: string;
    url: string;
    size: number;
    mimeType: string;
  }[];
  mentions?: UUID[];
  replyToId?: UUID;
  isEdited: boolean;
  editedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ChatPresence {
  id: UUID;
  threadId: UUID;
  userId: UUID;
  lastSeenAt: Timestamp;
  isTyping: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}