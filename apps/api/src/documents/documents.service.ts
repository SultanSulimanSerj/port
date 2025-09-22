import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, desc } from 'drizzle-orm';
import { db, documents, documentVersions } from '../database';
import { CreateDocumentDto, UpdateDocumentDto } from '@saas-portal/shared';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class DocumentsService {
  constructor(private uploadsService: UploadsService) {}

  async findByObjectId(objectId: string) {
    return db.select().from(documents)
      .where(and(eq(documents.objectId, objectId), eq(documents.isLatest, true)))
      .orderBy(desc(documents.createdAt));
  }

  async findById(id: string) {
    const result = await db.select().from(documents).where(eq(documents.id, id));
    
    if (result.length === 0) {
      throw new NotFoundException('Document not found');
    }

    return result[0];
  }

  async create(createDocumentDto: CreateDocumentDto, fileKey: string, uploadedBy: string) {
    const result = await db.insert(documents).values({
      ...createDocumentDto,
      fileKey,
      uploadedBy,
      version: 1,
      isLatest: true,
    }).returning();

    // Create first version
    await db.insert(documentVersions).values({
      documentId: result[0].id,
      version: 1,
      fileKey,
      fileName: createDocumentDto.fileName,
      fileSize: createDocumentDto.fileSize,
      mimeType: createDocumentDto.mimeType,
      uploadedBy,
    });

    return result[0];
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    await this.findById(id);

    const result = await db.update(documents)
      .set({
        ...updateDocumentDto,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();

    return result[0];
  }

  async delete(id: string) {
    const document = await this.findById(id);

    // Delete from S3
    await this.uploadsService.deleteFile(document.fileKey);

    // Delete all versions from S3
    const versions = await db.select().from(documentVersions)
      .where(eq(documentVersions.documentId, id));
    
    for (const version of versions) {
      await this.uploadsService.deleteFile(version.fileKey);
    }

    // Delete from database
    await db.delete(documentVersions).where(eq(documentVersions.documentId, id));
    await db.delete(documents).where(eq(documents.id, id));

    return { message: 'Document deleted successfully' };
  }

  async createVersion(documentId: string, fileKey: string, fileName: string, fileSize: number, mimeType: string, uploadedBy: string) {
    const document = await this.findById(documentId);
    const newVersion = document.version + 1;

    // Update current document to not be latest
    await db.update(documents)
      .set({ isLatest: false })
      .where(eq(documents.id, documentId));

    // Create new version as latest
    const result = await db.insert(documents).values({
      objectId: document.objectId,
      name: document.name,
      description: document.description,
      fileKey,
      fileName,
      fileSize,
      mimeType,
      version: newVersion,
      isLatest: true,
      uploadedBy,
    }).returning();

    // Create version record
    await db.insert(documentVersions).values({
      documentId: result[0].id,
      version: newVersion,
      fileKey,
      fileName,
      fileSize,
      mimeType,
      uploadedBy,
    });

    return result[0];
  }

  async getVersions(documentId: string) {
    await this.findById(documentId);

    return db.select().from(documentVersions)
      .where(eq(documentVersions.documentId, documentId))
      .orderBy(desc(documentVersions.version));
  }

  async generateDownloadUrl(id: string) {
    const document = await this.findById(id);
    const downloadUrl = await this.uploadsService.generateDownloadUrl(document.fileKey);
    
    return { downloadUrl };
  }
}