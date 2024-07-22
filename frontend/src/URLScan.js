import React, { useState } from 'react';
import axios from 'axios';

const URLScan = ({ onScan }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState(null);

  const handleScan = async () => {
    try {
      const response = await axios.post('/api/scan', { url });
      onScan(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(`Failed to fetch CSS from URL: ${err.response ? err.response.data : err.message}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter CSS file URL"
      />
      <button onClick={handleScan}>Scan</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default URLScan;
