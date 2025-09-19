'use client';

import { useState, useEffect } from 'react';

interface Bot {
  id: string;
  name: string;
  status: string;
  openmic_uid?: string;
  uid?: string;
  prompt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  const [newBot, setNewBot] = useState({ name: '', openmic_uid: '', prompt: '' });

  // Fetch bots from API
  const fetchBots = async () => {
    try {
      const response = await fetch('/api/bots');
      const data = await response.json();
      setBots(data.bots || []);
    } catch (error) {
      console.error('Error fetching bots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleCreate = async () => {
    if (!newBot.name) return;
    
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBot)
      });
      
      if (response.ok) {
        await fetchBots(); // Refresh list
        setNewBot({ name: '', openmic_uid: '', prompt: '' });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Error creating bot:', error);
    }
  };

  const handleEdit = (bot: Bot) => {
    setEditingBot(bot);
    setNewBot({
      name: bot.name,
      openmic_uid: bot.openmic_uid || '',
      prompt: bot.prompt || ''
    });
    setShowCreateForm(false); // Close create form if open
  };

  const handleUpdate = async () => {
    if (!editingBot || !newBot.name) return;
    
    try {
      const response = await fetch(`/api/bots/${editingBot.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newBot.name,
          openmic_uid: newBot.openmic_uid,
          prompt: newBot.prompt
        })
      });
      
      if (response.ok) {
        await fetchBots(); // Refresh list
        setEditingBot(null);
        setNewBot({ name: '', openmic_uid: '', prompt: '' });
      }
    } catch (error) {
      console.error('Error updating bot:', error);
    }
  };

  const cancelEdit = () => {
    setEditingBot(null);
    setNewBot({ name: '', openmic_uid: '', prompt: '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bot?')) return;
    
    try {
      const response = await fetch(`/api/bots/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchBots(); // Refresh list
      }
    } catch (error) {
      console.error('Error deleting bot:', error);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await fetch(`/api/bots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        await fetchBots(); // Refresh list
      }
    } catch (error) {
      console.error('Error updating bot:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading bots...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Bot Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your AI receptionist bots and their OpenMic integrations.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => {
              setShowCreateForm(true);
              setEditingBot(null); // Close edit form if open
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700"
          >
            Add Bot
          </button>
        </div>
      </div>

      {/* Edit Form (shows when editing) */}
      {editingBot && (
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-400">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Edit Bot - {editingBot.name}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bot Name</label>
              <input
                type="text"
                value={newBot.name}
                onChange={(e) => setNewBot({...newBot, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g., Reception Bot"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">OpenMic UID</label>
              <input
                type="text"
                value={newBot.openmic_uid}
                onChange={(e) => setNewBot({...newBot, openmic_uid: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g., openmic_xyz789"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Bot Prompt</label>
              <textarea
                value={newBot.prompt}
                onChange={(e) => setNewBot({...newBot, prompt: e.target.value})}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="Enter bot instructions and personality..."
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={cancelEdit}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={!newBot.name}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Update Bot
            </button>
          </div>
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-400">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Bot</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Bot Name</label>
              <input
                type="text"
                value={newBot.name}
                onChange={(e) => setNewBot({...newBot, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g., Reception Bot"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">OpenMic UID</label>
              <input
                type="text"
                value={newBot.openmic_uid}
                onChange={(e) => setNewBot({...newBot, openmic_uid: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g., openmic_xyz789"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Bot Prompt</label>
              <textarea
                value={newBot.prompt}
                onChange={(e) => setNewBot({...newBot, prompt: e.target.value})}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm px-3 py-2 border"
                placeholder="Enter bot instructions and personality..."
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setShowCreateForm(false)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!newBot.name}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
            >
              Create Bot
            </button>
          </div>
        </div>
      )}

      {/* Bots List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {bots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No bots found. Create your first bot!</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bot Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bot UID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OpenMic UID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bots.map((bot) => (
                    <tr key={bot.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bot.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {bot.uid || bot.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {bot.openmic_uid || 'Not connected'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                            bot.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                          onClick={() => toggleStatus(bot.id, bot.status)}
                          title="Click to toggle status"
                        >
                          {bot.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(bot)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit bot details"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleStatus(bot.id, bot.status)}
                            className="text-amber-600 hover:text-amber-900"
                            title="Toggle bot status"
                          >
                            {bot.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => handleDelete(bot.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete bot"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
