import React, { useState } from 'react';
import FileUpload from './FileUpload';
import URLScan from './URLScan';

const App = () => {
  const [tokens, setTokens] = useState(null);

  const handleUpload = (result) => {
    setTokens(result);
  };

  const handleScan = (result) => {
    setTokens(result);
  };

  return (
    <div>
      <h1>TokenTracker</h1>
      <FileUpload onUpload={handleUpload} />
      <URLScan onScan={handleScan} />
      {tokens && (
        <div>
          <h2>Token Analysis</h2>
          <pre>{JSON.stringify(tokens, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
