"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function ObjectDetailPage() {
  const params = useParams();
  const objectId = params.id as string;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-6">
        <Link href="/objects" className="text-blue-600 hover:underline">
          ← Back to Objects
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Object Details</h1>
      <p className="text-gray-600 mb-8">Object ID: {objectId}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href={`/objects/${objectId}/documents`}>
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="text-xl font-semibold mb-2">Documents</h3>
            <p className="text-gray-600">
              Upload, manage, and version control project documents
            </p>
          </div>
        </Link>

        <div className="border rounded-lg p-6 bg-gray-50 opacity-60">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="text-xl font-semibold mb-2">Tasks</h3>
          <p className="text-gray-600">
            Manage project tasks and schedules (Coming in Phase 4)
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 opacity-60">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="text-xl font-semibold mb-2">Finance</h3>
          <p className="text-gray-600">
            Track expenses, revenue, and margins (Coming in Phase 5)
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 opacity-60">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="text-xl font-semibold mb-2">Members</h3>
          <p className="text-gray-600">
            Manage object members and roles
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 opacity-60">
          <div className="text-3xl mb-3">✔️</div>
          <h3 className="text-xl font-semibold mb-2">Approvals</h3>
          <p className="text-gray-600">
            Approval workflows and decisions (Coming in Phase 6)
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 opacity-60">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="text-xl font-semibold mb-2">Chat</h3>
          <p className="text-gray-600">
            Real-time project communication (Coming in Phase 7)
          </p>
        </div>
      </div>
    </div>
  );
}