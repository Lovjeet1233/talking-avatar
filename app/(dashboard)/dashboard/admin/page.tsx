'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Stats {
  overview: {
    totalUsers: number;
    totalConversations: number;
    totalMessages: number;
    totalKnowledgeBases: number;
    activeUsers: number;
    avgMessagesPerConversation: number;
  };
  conversations: {
    active: number;
    completed: number;
  };
  recentActivity: {
    conversationsLast30Days: number;
    messagesLast30Days: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      } else if (response.status === 403) {
        alert('Admin access required');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600">Failed to load statistics</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and statistics</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => router.push('/dashboard/admin/users')}
          className="p-6 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-lg text-left"
        >
          <div className="text-3xl font-bold">{stats.overview.totalUsers}</div>
          <div className="text-blue-100 mt-2">Manage Users</div>
        </button>
        <button
          onClick={() => router.push('/dashboard/admin/conversations')}
          className="p-6 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-all shadow-lg text-left"
        >
          <div className="text-3xl font-bold">{stats.overview.totalConversations}</div>
          <div className="text-green-100 mt-2">View All Chats</div>
        </button>
        <button
          onClick={() => router.push('/dashboard/knowledge-bases')}
          className="p-6 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-all shadow-lg text-left"
        >
          <div className="text-3xl font-bold">{stats.overview.totalKnowledgeBases}</div>
          <div className="text-purple-100 mt-2">Knowledge Bases</div>
        </button>
      </div>

      {/* Overview Stats */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <div className="text-gray-600 text-sm mb-1">Total Users</div>
            <div className="text-3xl font-bold text-gray-900">{stats.overview.totalUsers}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Active Users (7d)</div>
            <div className="text-3xl font-bold text-green-600">{stats.overview.activeUsers}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Total Conversations</div>
            <div className="text-3xl font-bold text-gray-900">{stats.overview.totalConversations}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Total Messages</div>
            <div className="text-3xl font-bold text-gray-900">{stats.overview.totalMessages}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Avg Messages/Chat</div>
            <div className="text-3xl font-bold text-blue-600">{stats.overview.avgMessagesPerConversation}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm mb-1">Knowledge Bases</div>
            <div className="text-3xl font-bold text-gray-900">{stats.overview.totalKnowledgeBases}</div>
          </div>
        </div>
      </div>

      {/* Conversation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Conversations</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active</span>
              <span className="text-2xl font-bold text-green-600">{stats.conversations.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="text-2xl font-bold text-gray-900">{stats.conversations.completed}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity (30 Days)</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Conversations</span>
              <span className="text-2xl font-bold text-blue-600">{stats.recentActivity.conversationsLast30Days}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Messages Sent</span>
              <span className="text-2xl font-bold text-purple-600">{stats.recentActivity.messagesLast30Days}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

