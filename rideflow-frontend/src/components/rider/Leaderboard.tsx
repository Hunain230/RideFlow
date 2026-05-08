import React, { useState, useEffect } from 'react';
import { Trophy, MapPin, Car } from 'lucide-react';
import { RatingDisplay } from '../ui/RatingDisplay';

interface Driver {
  rank: number;
  driverName: string;
  averageRating: number;
  totalRatings: number;
  totalRides: number;
  vehicleType: string;
  city: string;
}

interface LeaderboardResponse {
  success: boolean;
  data: {
    city: string;
    minRides: number;
    topDrivers: Driver[];
  };
  error?: string;
}

export const Leaderboard: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [minRides, setMinRides] = useState<string>('10');

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar'];

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedCity, minRides]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (selectedCity) params.append('city', selectedCity);
      if (minRides && minRides !== '10') params.append('minRides', minRides);
      
      const response = await fetch(`/api/rider/leaderboard?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }
      
      const data: LeaderboardResponse = await response.json();
      
      if (data.success) {
        setDrivers(data.data.topDrivers);
      } else {
        throw new Error(data.error || 'Failed to load leaderboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"><Trophy className="w-5 h-5 text-white" /></div>;
      case 2:
        return <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"><span className="text-white font-bold">2</span></div>;
      case 3:
        return <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center"><span className="text-white font-bold">3</span></div>;
      default:
        return <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><span className="text-gray-600 font-medium">{rank}</span></div>;
    }
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'Bike':
        return <Car className="w-4 h-4" />;
      default:
        return <Car className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={fetchLeaderboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900">Driver Leaderboard</h1>
          </div>
          
          <p className="text-gray-600 mb-6">
            Top-rated drivers based on customer feedback and ride history
          </p>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rides
              </label>
              <select
                value={minRides}
                onChange={(e) => setMinRides(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">5+ rides</option>
                <option value="10">10+ rides</option>
                <option value="25">25+ rides</option>
                <option value="50">50+ rides</option>
                <option value="100">100+ rides</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="p-6">
          {drivers.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No drivers found matching these criteria</p>
            </div>
          ) : (
            <div className="space-y-3">
              {drivers.map((driver) => (
                <div
                  key={`${driver.driverName}-${driver.rank}`}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankIcon(driver.rank)}
                  </div>

                  {/* Driver Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {driver.driverName}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        {getVehicleIcon(driver.vehicleType)}
                        <span>{driver.vehicleType}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{driver.city}</span>
                      </div>
                      <span>{driver.totalRides} rides</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex-shrink-0 text-right">
                    <RatingDisplay rating={driver.averageRating} totalRatings={driver.totalRatings} />
                    <div className="text-xs text-gray-500 mt-1">
                      {driver.totalRatings} ratings
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
