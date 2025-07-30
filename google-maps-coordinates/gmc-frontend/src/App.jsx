import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [mapUrl, setMapUrl] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/coordinates', {
        mapUrl
      });

      setCoordinates(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get coordinates');
      setCoordinates(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Google Maps Coordinates Extractor</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          value={mapUrl}
          onChange={(e) => setMapUrl(e.target.value)}
          placeholder="Paste Google Maps link here"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Get Coordinates'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {coordinates && (
        <div className="result">
          <h2>Coordinates:</h2>
          <p>Latitude: {coordinates.latitude}</p>
          <p>Longitude: {coordinates.longitude}</p>
          {coordinates.fromCache && <p className="cache-note">(From cache)</p>}
        </div>
      )}

      <div className="example">
        <p>Example URL: https://maps.app.goo.gl/vURqYiX57oEown6N6</p>
      </div>
    </div>
  );
}

export default App;