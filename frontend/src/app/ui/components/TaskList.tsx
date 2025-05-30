'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash } from 'lucide-react';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10); 
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchTasks();
  }, [currentPage, perPage]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks?page=${currentPage}&per_page=${perPage}`);
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();

      setTasks(data.tasks); 
      setTotalPages(data.pagination.pages);
      setTotalTasks(data.pagination.total);
      setHasNext(data.pagination.has_next);
      setHasPrev(data.pagination.has_prev);

    } catch (err) {
      console.error('Failed to fetch tasks: ', err);
    }
  };

  const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, status: newStatus }),
    });
    setNewName('');
    setNewStatus(false);
    setShowForm(false);
    setCurrentPage(1); 
    fetchTasks();
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      console.log("Delete successful");
      if (tasks.length === 1 && currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
      } else {
        fetchTasks(); 
      }
    } else {
      console.log("Failed to delete task");
    }
  };

  const goToNextPage = () => {
    if (hasNext) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (hasPrev) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); 
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Tasks ({totalTasks} total)</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-full text-lg font-bold"
          title="Add Task"
        >
          +
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddTask}
          className="mb-6 bg-gray-100 p-4 rounded-xl shadow"
        >
          <div className="mb-2">
            <label className="block text-sm font-medium">Name</label>
            <input
              className="w-full border p-2 rounded"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Status</label>
            <select
              className="w-full border p-2 rounded"
              value={newStatus ? 'true' : 'false'}
              onChange={(e) => setNewStatus(e.target.value === 'true')}
            >
              <option value="false">Incomplete</option>
              <option value="true">Completed</option>
            </select>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setNewName('');
                setNewStatus(false);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 && !showForm ? (
        <p className="text-center text-gray-500 mt-8">No tasks found. Add a new task!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tasks.map((task: any) => (
            <div key={task.id} className="relative">
              <Link href={`/tasks/${task.id}`}>
                <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer">
                  <h3 className="text-xl font-semibold mb-2">{task.name}</h3>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      task.status ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {task.status ? 'Completed' : 'Incomplete'}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => handleDelete(task.id)}
                className="absolute top-2 right-2 p-1 bg-red-100 hover:bg-red-200 rounded-full z-10"
              >
                <Trash className="w-3 h-3 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}


      {totalTasks > 0 && ( 
        <div className="flex justify-between items-center mt-8 px-4 py-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <label htmlFor="per-page-select" className="text-sm text-gray-700">Show per page:</label>
            <select
              id="per-page-select"
              value={perPage}
              onChange={handlePerPageChange}
              className="border border-gray-300 rounded-md py-1 px-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={goToPrevPage}
              disabled={!hasPrev}
              className={`px-4 py-2 rounded ${
                !hasPrev ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => goToPage(index + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={goToNextPage}
              disabled={!hasNext}
              className={`px-4 py-2 rounded ${
                !hasNext ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}