import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await fetch('/api/PersonalizedSearch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user1', query })
    });
    const data = await res.json();
    setResults(data);
  };

  return (
    <div>
      <h1>Personalized Search</h1>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={search}>Search</button>
      <ul>
        {results.map(r => (
          <li key={r.id}>{r.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
