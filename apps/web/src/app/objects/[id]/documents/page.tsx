"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { UploadButton } from "../../../../components/documents/upload-button";
import { DocumentList } from "../../../../components/documents/document-list";

export default function DocumentsPage() {
  const params = useParams();
  const objectId = params.id as string;
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-gray-600 mt-1">Object ID: {objectId}</p>
        </div>
        <UploadButton objectId={objectId} onUploadComplete={handleUploadComplete} />
      </div>

      <div className="mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Document Management Features</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>✅ Direct S3 upload with presigned URLs</li>
            <li>✅ Document versioning support</li>
            <li>✅ File type validation and preview</li>
            <li>✅ Download with presigned URLs</li>
            <li>✅ Link to Approvals workflow (mock implementation)</li>
          </ul>
        </div>
      </div>

      <DocumentList objectId={objectId} refreshTrigger={refreshTrigger} />
    </div>
  );
}