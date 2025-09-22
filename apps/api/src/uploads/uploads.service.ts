import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { PresignedUploadRequest, PresignedUploadResponse } from '@saas-portal/shared';

@Injectable()
export class UploadsService {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      endpoint: this.configService.get('S3_ENDPOINT'),
      region: this.configService.get('S3_REGION', 'us-east-1'),
      accessKeyId: this.configService.get('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('S3_SECRET_ACCESS_KEY'),
      s3ForcePathStyle: true, // Needed for local development with MinIO
    });
  }

  async generatePresignedUpload(
    companyId: string,
    request: PresignedUploadRequest
  ): Promise<PresignedUploadResponse> {
    const fileKey = this.generateFileKey(companyId, request.fileName);
    const bucket = this.configService.get('S3_BUCKET', 'saas-portal-dev');

    const params = {
      Bucket: bucket,
      Key: fileKey,
      ContentType: request.mimeType,
      ContentLength: request.fileSize,
      Expires: 3600, // 1 hour
    };

    try {
      // Generate presigned POST for direct browser upload
      const presignedPost = this.s3.createPresignedPost({
        Bucket: bucket,
        Key: fileKey,
        Fields: {
          'Content-Type': request.mimeType,
        },
        Conditions: [
          ['content-length-range', 0, request.fileSize],
          ['eq', '$Content-Type', request.mimeType],
        ],
        Expires: 3600,
      });

      return {
        uploadUrl: presignedPost.url,
        fileKey,
        fields: presignedPost.fields,
      };
    } catch (error) {
      console.error('Error generating presigned upload:', error);
      throw new Error('Failed to generate upload URL');
    }
  }

  async generateDownloadUrl(fileKey: string): Promise<string> {
    const bucket = this.configService.get('S3_BUCKET', 'saas-portal-dev');

    const params = {
      Bucket: bucket,
      Key: fileKey,
      Expires: 3600, // 1 hour
    };

    try {
      return this.s3.getSignedUrl('getObject', params);
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  async deleteFile(fileKey: string): Promise<void> {
    const bucket = this.configService.get('S3_BUCKET', 'saas-portal-dev');

    const params = {
      Bucket: bucket,
      Key: fileKey,
    };

    try {
      await this.s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  private generateFileKey(companyId: string, fileName: string): string {
    const timestamp = Date.now();
    const uuid = uuidv4();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    return `companies/${companyId}/documents/${timestamp}-${uuid}-${sanitizedFileName}`;
  }
}