"use client";

import { useState, useRef } from "react";
import { PresignedUploadRequest, CreateDocumentDto } from "@saas-portal/shared";

interface UploadButtonProps {
  objectId: string;
  onUploadComplete?: () => void;
}

export function UploadButton({ objectId, onUploadComplete }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Step 1: Get presigned upload URL
      const uploadRequest: PresignedUploadRequest = {
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
      };

      const presignedResponse = await fetch(`/api/uploads/sign?companyId=mock-company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadRequest),
      });

      if (!presignedResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { uploadUrl, fileKey, fields } = await presignedResponse.json();

      // Step 2: Upload file directly to S3
      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append('file', file);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      // Step 3: Save document metadata
      const documentData: CreateDocumentDto & { fileKey: string } = {
        objectId,
        name: file.name,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        fileKey,
      };

      const documentResponse = await fetch(`/api/documents?uploadedBy=mock-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(documentData),
      });

      if (!documentResponse.ok) {
        throw new Error('Failed to save document');
      }

      onUploadComplete?.();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </div>
  );
}