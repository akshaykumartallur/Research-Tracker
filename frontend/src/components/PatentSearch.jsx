// frontend/src/components/PatentSearch.js
import React, { useState } from 'react';
import axios from 'axios';

const PatentSearch = () => {
  const [patentNumber, setPatentNumber] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/patents/search?patentNumber=${patentNumber}`);
      setResult(res.data);
    } catch (error) {
      console.error('Error fetching patent details', error);
      setResult(null);
    }
  };

  return (
    <div>
      <h2>Search Patent by Number</h2>
      <input
        type="text"
        value={patentNumber}
        onChange={(e) => setPatentNumber(e.target.value)}
        placeholder="Enter patent number"
      />
      <button onClick={handleSearch}>Search</button>

      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
};

export default PatentSearch;
