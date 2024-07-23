import React, { useState } from 'react';

const ComponentConfig = ({ onSubmit }) => {
  const [configs, setConfigs] = useState([{ selector: '', component: '' }]);

  const handleChange = (index, field, value) => {
    const newConfigs = [...configs];
    newConfigs[index][field] = value;
    setConfigs(newConfigs);
  };

  const handleAdd = () => {
    setConfigs([...configs, { selector: '', component: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(configs);
  };

  return (
    <form onSubmit={handleSubmit}>
      {configs.map((config, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="CSS Selector"
            value={config.selector}
            onChange={(e) => handleChange(index, 'selector', e.target.value)}
          />
          <input
            type="text"
            placeholder="Component Name"
            value={config.component}
            onChange={(e) => handleChange(index, 'component', e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={handleAdd}>Add Component</button>
      <button type="submit">Save Configuration</button>
    </form>
  );
};

export default ComponentConfig;
