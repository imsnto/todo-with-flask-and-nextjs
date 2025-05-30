'use client';

import React, { useEffect, useState } from 'react';

export default function TaskDetailPage({ params: ParamsPromise }) {
  const params = React.use(ParamsPromise);
  const [task, setTask] = useState(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/tasks/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTask(data);
        setName(data.name);
        setStatus(data.status);
      });
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://127.0.0.1:5000/tasks/${params.id}`, {
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
              value={status}
              onChange={(e) => setStatus(e.target.value === 'true')}
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
