'use client';

import React, { useEffect, useState } from 'react';

interface Params {
  id: number;
}

interface Task {
  id: number;
  name: string;
  status: boolean;
}

export default function TaskDetailPage({ params: ParamsPromise }: { params: Promise<Params> }) {
  const params = React.use(ParamsPromise);
  const {id} = params;
  const [task, setTask] = useState<Task | null>(null);;
  const [name, setName] = useState<string>('');
  const [status, setStatus] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false); 
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/tasks/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTask(data);
        setName(data.name);
        setStatus(data.status);
      });
  }, [id]);

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, status }),
    });

    if (res.ok) {
      setMessage('Task updated successfully!');
      setIsEditing(false); 
      const updated = await res.json();
      setTask(updated); 
    } else {
      setMessage('Failed to update task.');
    }
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Detail</h1>

      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      {!isEditing ? (
        <>
          <p><strong>ID:</strong> {task.id}</p>
          <p><strong>Name:</strong> {task.name}</p>
          <p>
            
            <strong>Status:</strong> {task.status ? 'Completed' : 'Incomplete'}
          </p>

          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              className="w-full mt-1 border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              className="w-full mt-1 border p-2 rounded"
              value={status ? 'true' : 'false'}
              onChange={(e) => setStatus(e.target.value == 'true')}
            >
              <option value="true">Completed</option>
              <option value="false">Incomplete</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Task
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
