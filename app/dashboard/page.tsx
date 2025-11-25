"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  trustScore: number;
  totalReviews: number;
  totalEndorsements: number;
  monthlyVisits: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        trustScore: 85,
        totalReviews: 24,
        totalEndorsements: 12,
        monthlyVisits: 156
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Business Dashboard</h1>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Business Dashboard</h1>
        <Link 
          href="/analytics" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Analytics
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Trust Score</h2>
          <p className="text-3xl font-bold text-green-600">{stats?.trustScore}</p>
          <p className="text-sm text-gray-600 mt-1">Your business credibility</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Reviews</h2>
          <p className="text-3xl font-bold text-blue-600">{stats?.totalReviews}</p>
          <p className="text-sm text-gray-600 mt-1">Customer feedback</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Endorsements</h2>
          <p className="text-3xl font-bold text-purple-600">{stats?.totalEndorsements}</p>
          <p className="text-sm text-gray-600 mt-1">Community support</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Monthly Visits</h2>
          <p className="text-3xl font-bold text-orange-600">{stats?.monthlyVisits}</p>
          <p className="text-sm text-gray-600 mt-1">Profile views</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/business/edit" 
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
          >
            <h3 className="font-semibold text-gray-800">Edit Profile</h3>
            <p className="text-sm text-gray-600">Update business information</p>
          </Link>
          
          <Link 
            href="/business/qr" 
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
          >
            <h3 className="font-semibold text-gray-800">QR Code</h3>
            <p className="text-sm text-gray-600">Share your digital card</p>
          </Link>
          
          <Link 
            href="/analytics" 
            className="bg-gray-100 hover:bg-gray-200 p-4 rounded-lg text-center transition-colors"
          >
            <h3 className="font-semibold text-gray-800">View Analytics</h3>
            <p className="text-sm text-gray-600">Detailed insights</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
