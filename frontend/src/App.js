import React, { useState } from 'react';
import ComponentConfig from './components/ComponentConfig';

const App = () => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [configs, setConfigs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('url', url);
    formData.append('file', file);
    formData.append('componentConfigs', JSON.stringify(configs));

    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    console.log(result); // Handle the result in your application
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL" />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Analyze</button>
      </form>
      <ComponentConfig onSubmit={setConfigs} />
    </div>
  );
};

export default App;
