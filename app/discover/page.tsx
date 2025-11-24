"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Business {
  id: string;
  name: string;
  category: string;
  trustScore: number;
  location: string;
}

export default function DiscoverPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBusinesses([
        { id: '1', name: 'Local Chai Corner', category: 'Food & Restaurant', trustScore: 85, location: 'Delhi' },
        { id: '2', name: 'Handmade Crafts', category: 'Artisan', trustScore: 92, location: 'Bangalore' },
        { id: '3', name: 'Quick Repair Services', category: 'Services', trustScore: 78, location: 'Mumbai' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Discover Local Businesses</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Discover Local Businesses</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search businesses by name, category, or location..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Business List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business) => (
          <Link 
            key={business.id}
            href={`/business/${business.id}`}
            className="bg-white rounded-lg shadow border p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{business.name}</h3>
            <p className="text-gray-600 mb-2">{business.category}</p>
            <p className="text-gray-500 text-sm mb-3">{business.location}</p>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                business.trustScore >= 80 ? 'bg-green-100 text-green-800' :
                business.trustScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                Trust Score: {business.trustScore}
              </span>
              <span className="text-blue-600 text-sm font-medium">View Profile →</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No businesses found matching your search.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
