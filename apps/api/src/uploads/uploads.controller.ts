import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { PresignedUploadRequest } from '@saas-portal/shared';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('sign')
  @ApiOperation({ summary: 'Generate presigned upload URL' })
  @ApiResponse({ status: 201, description: 'Presigned upload URL generated' })
  async generatePresignedUpload(
    @Body() request: PresignedUploadRequest,
    @Query('companyId') companyId: string
  ) {
    return this.uploadsService.generatePresignedUpload(companyId, request);
  }

  @Get('download/:fileKey')
  @ApiOperation({ summary: 'Generate download URL' })
  @ApiResponse({ status: 200, description: 'Download URL generated' })
  async generateDownloadUrl(@Param('fileKey') fileKey: string) {
    const downloadUrl = await this.uploadsService.generateDownloadUrl(fileKey);
    return { downloadUrl };
  }
}