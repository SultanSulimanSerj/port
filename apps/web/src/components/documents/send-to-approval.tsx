"use client";

import { useState } from "react";

interface SendToApprovalProps {
  documentId: string;
  documentName: string;
}

export function SendToApproval({ documentId, documentName }: SendToApprovalProps) {
  const [showModal, setShowModal] = useState(false);
  const [approvalTitle, setApprovalTitle] = useState(`Approval for ${documentName}`);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock approval request creation
    console.log('Creating approval request:', {
      documentId,
      title: approvalTitle,
      dueDate,
      contextType: 'DOCUMENT',
      contextId: documentId,
    });

    alert('Approval request created successfully! (Mock implementation - will be implemented in Phase 6)');
    setShowModal(false);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-green-600 hover:text-green-800 text-sm"
      >
        Send to Approval
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Send Document to Approval</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Approval Title</label>
                <input
                  type="text"
                  value={approvalTitle}
                  onChange={(e) => setApprovalTitle(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-blue-800 text-sm">
                  📋 This will create an approval request that can be assigned to team members for review and approval.
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  Full approval workflow will be implemented in Phase 6
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Create Approval Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}