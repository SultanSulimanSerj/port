import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, UpdateDocumentDto, DocumentMetadata } from '@saas-portal/shared';

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get documents by object ID' })
  async findByObjectId(@Query('objectId') objectId: string) {
    return this.documentsService.findByObjectId(objectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  async findOne(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create document after successful upload' })
  async create(
    @Body() body: CreateDocumentDto & DocumentMetadata,
    @Query('uploadedBy') uploadedBy: string
  ) {
    const { fileKey, ...createDocumentDto } = body;
    return this.documentsService.create(createDocumentDto, fileKey, uploadedBy);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update document metadata' })
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto
  ) {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  async remove(@Param('id') id: string) {
    return this.documentsService.delete(id);
  }

  @Post(':id/versions')
  @ApiOperation({ summary: 'Create new version of document' })
  async createVersion(
    @Param('id') id: string,
    @Body() body: DocumentMetadata,
    @Query('uploadedBy') uploadedBy: string
  ) {
    return this.documentsService.createVersion(
      id,
      body.fileKey,
      body.fileName,
      body.fileSize,
      body.mimeType,
      uploadedBy
    );
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get document versions' })
  async getVersions(@Param('id') id: string) {
    return this.documentsService.getVersions(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get document download URL' })
  async generateDownloadUrl(@Param('id') id: string) {
    return this.documentsService.generateDownloadUrl(id);
  }
}