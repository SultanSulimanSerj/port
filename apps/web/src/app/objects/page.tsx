"use client";

import { useState, useEffect } from "react";
import { CreateObjectDto, ObjectStatus } from "@saas-portal/shared";

interface ObjectType {
  id: string;
  name: string;
  description?: string;
  status: ObjectStatus;
  budget?: number;
  currency: string;
  createdAt: string;
}

export default function ObjectsPage() {
  const [objects, setObjects] = useState<ObjectType[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newObject, setNewObject] = useState<CreateObjectDto>({
    name: "",
    description: "",
    status: "DRAFT",
    currency: "USD",
  });

  const fetchObjects = async () => {
    try {
      // Mock data for now since we don't have auth yet
      const mockObjects: ObjectType[] = [
        {
          id: "1",
          name: "Project Alpha",
          description: "Main development project",
          status: "ACTIVE",
          budget: 100000,
          currency: "USD",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2", 
          name: "Project Beta",
          description: "Secondary project",
          status: "DRAFT",
          budget: 50000,
          currency: "USD",
          createdAt: new Date().toISOString(),
        },
      ];
      setObjects(mockObjects);
    } catch (error) {
      console.error("Failed to fetch objects:", error);
    }
  };

  useEffect(() => {
    fetchObjects();
  }, []);

  const handleCreateObject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Mock creation for now
      const mockNewObject: ObjectType = {
        id: Date.now().toString(),
        ...newObject,
        createdAt: new Date().toISOString(),
      };
      setObjects([mockNewObject, ...objects]);
      setNewObject({ name: "", description: "", status: "DRAFT", currency: "USD" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create object:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Objects</h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Object
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Create New Object</h2>
          <form onSubmit={handleCreateObject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={newObject.name}
                onChange={(e) => setNewObject({ ...newObject, name: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newObject.description}
                onChange={(e) => setNewObject({ ...newObject, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={newObject.status}
                onChange={(e) => setNewObject({ ...newObject, status: e.target.value as ObjectStatus })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {objects.map((object) => (
          <div key={object.id} className="border rounded p-4 bg-white shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold">{object.name}</h3>
                {object.description && (
                  <p className="text-gray-600 mt-1">{object.description}</p>
                )}
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    object.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    object.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                    object.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800' :
                    object.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {object.status}
                  </span>
                  {object.budget && (
                    <span className="text-sm text-gray-500">
                      Budget: {object.budget.toLocaleString()} {object.currency}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(object.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {objects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No objects found. Create your first object to get started.
        </div>
      )}
    </div>
  );
}