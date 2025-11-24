"use client";

import { useState, useEffect } from 'react';

interface CacheStats {
  keys: number;
  memory: {
    used_memory_human: string;
  };
  info: {
    redis_version: string;
  };
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would typically fetch from your API
    setTimeout(() => {
      setStats({
        keys: 0,
        memory: { used_memory_human: '0B' },
        info: { redis_version: 'N/A' }
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Business Analytics</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Business Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-2">Cache Statistics</h2>
          <p className="text-sm text-gray-600">Keys: {stats?.keys || 0}</p>
          <p className="text-sm text-gray-600">Memory: {stats?.memory.used_memory_human}</p>
          <p className="text-sm text-gray-600">Redis: {stats?.info.redis_version}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-2">Trust Score Trends</h2>
          <p className="text-gray-600">Track your business credibility over time.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-2">Customer Insights</h2>
          <p className="text-gray-600">Understand your customer feedback patterns.</p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800">Development Notice</h3>
        <p className="text-yellow-700 text-sm mt-1">
          The analytics dashboard is currently under development. Advanced features will be available soon.
        </p>
      </div>
    </div>
  );
}
