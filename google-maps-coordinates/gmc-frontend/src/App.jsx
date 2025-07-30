import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Assuming you have a CSS file for styles

const CoordinatesExtractor = () => {
  const [mapUrl, setMapUrl] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCoordinates(null);
    setCopied(false);

    try {
      const response = await axios.post('http://localhost:5000/api/coordinates', {
        mapUrl
      }, {
        timeout: 10000
      });

      if (response.data?.latitude && response.data?.longitude) {
        setCoordinates(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to extract coordinates');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (coordinates) {
      navigator.clipboard.writeText(`${coordinates.latitude}, ${coordinates.longitude}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-4 sm:p-6 lg:p-8">
      <div className="bg-white/95 backdrop-blur-sm lg:backdrop-blur-md w-full max-w-lg rounded-3xl shadow-xl border border-blue-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Maps Coordinates Extractor</h1>
          <p className="text-blue-100">Convert Google Maps links to precise coordinates</p>
        </div>

        {/* Main Content */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="mapUrl" className="block text-sm font-medium text-blue-800 mb-2">
                Google Maps URL
              </label>
              <div className="relative">
                <input
                  id="mapUrl"
                  type="url"
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full px-5 py-3 text-base border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50/60 transition-all duration-200 shadow-sm placeholder-blue-300"
                  required
                  pattern="https?://.*"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              <span className="group-hover:scale-105 transition-transform duration-200">
                {loading ? 'Processing...' : 'Extract Coordinates'}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loading ? 'animate-spin' : 'group-hover:translate-x-1'} transition-all duration-200`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={loading ? "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" : "M14 5l7 7m0 0l-7 7m7-7H3"} />
              </svg>
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50/80 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start">
              <svg className="flex-shrink-0 w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="font-medium">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {coordinates && (
            <div className="mt-8 space-y-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-blue-800">Extracted Coordinates</h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200/70 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-sm font-medium text-blue-600 mb-1">Latitude</p>
                  <p className="text-2xl font-mono font-bold text-blue-900 truncate" title={coordinates.latitude}>
                    {coordinates.latitude}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200/70 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <p className="text-sm font-medium text-blue-600 mb-1">Longitude</p>
                  <p className="text-2xl font-mono font-bold text-blue-900 truncate" title={coordinates.longitude}>
                    {coordinates.longitude}
                  </p>
                </div>
              </div>

              {coordinates.fromCache && (
                <div className="flex items-center justify-center text-blue-600 text-sm mt-2">
                  <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Served from cache for faster results</span>
                </div>
              )}

              <div className="pt-4 border-t border-blue-100">
                <button
                  onClick={() => window.open(`https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`, '_blank')}
                  className="w-full bg-white border border-blue-300 text-blue-600 py-2.5 rounded-lg font-medium text-sm shadow-sm hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Open in Google Maps
                </button>
              </div>
            </div>
          )}

          {/* Example Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-blue-500 mb-1">Try this example URL:</p>
            <div className="bg-blue-50/60 px-4 py-2 rounded-lg inline-block max-w-full overflow-x-auto">
              <code className="text-sm text-blue-600 font-mono break-all">
                https://maps.app.goo.gl/vURqYiX57oEown6N6
              </code>
            </div>
          </div>

          <div className="text-center mt-4 animate-fade-in delay-700">
            <p className="text-gray-800 text-xs sm:text-sm">
              © {new Date().getFullYear()} by{" "}
              <a
                href="https://zabinayath.space"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:underline"
              >
                zabinayath.space
              </a>. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinatesExtractor;