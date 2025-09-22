"use client";

import { useState } from "react";

interface DocumentPreviewProps {
  documentId: string;
  fileName: string;
  mimeType: string;
  onClose: () => void;
}

export function DocumentPreview({ documentId, fileName, mimeType, onClose }: DocumentPreviewProps) {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDownloadUrl = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      if (response.ok) {
        const { downloadUrl } = await response.json();
        setDownloadUrl(downloadUrl);
      }
    } catch (error) {
      console.error('Failed to get download URL:', error);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchDownloadUrl();
  });

  const renderPreview = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-96">Loading preview...</div>;
    }

    if (!downloadUrl) {
      return <div className="flex items-center justify-center h-96">Failed to load preview</div>;
    }

    if (mimeType.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center">
          <img src={downloadUrl} alt={fileName} className="max-w-full max-h-96 object-contain" />
        </div>
      );
    }

    if (mimeType === 'application/pdf') {
      return (
        <div className="w-full h-96">
          <iframe
            src={downloadUrl}
            className="w-full h-full border"
            title={fileName}
          />
        </div>
      );
    }

    // For other file types, show download link
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-6xl">📎</div>
        <p className="text-lg font-medium">{fileName}</p>
        <p className="text-gray-600">Preview not available for this file type</p>
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Open in New Tab
        </a>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{fileName}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}