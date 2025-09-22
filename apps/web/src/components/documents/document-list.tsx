"use client";

import { useState, useEffect } from "react";

interface Document {
  id: string;
  name: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  version: number;
  createdAt: string;
}

interface DocumentListProps {
  objectId: string;
  refreshTrigger?: number;
}

export function DocumentList({ objectId, refreshTrigger }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents?objectId=${objectId}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [objectId, refreshTrigger]);

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    return '📎';
  };

  const handleDownload = async (documentId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/download`);
      if (response.ok) {
        const { downloadUrl } = await response.json();
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to download document:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading documents...</div>;
  }

  return (
    <div className="space-y-4">
      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No documents uploaded yet.
        </div>
      ) : (
        documents.map((doc) => (
          <div key={doc.id} className="border rounded p-4 bg-white shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{getFileIcon(doc.mimeType)}</span>
                <div>
                  <h3 className="font-semibold">{doc.name}</h3>
                  {doc.description && (
                    <p className="text-gray-600 text-sm mt-1">{doc.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                    <span>{doc.fileName}</span>
                    <span>{formatFileSize(doc.fileSize)}</span>
                    <span>v{doc.version}</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(doc.id, doc.fileName)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Download
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm">
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}