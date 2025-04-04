import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = 'http://localhost:3000/numbers'; // Adjust if your backend runs on a different port or host

  const fetchNumbers = async (numberId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${baseUrl}/${numberId}`, { timeout: 1000 });
      setResponse(res.data);
    } catch (err) {
      setError('Failed to fetch numbers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderArray = (arr) => (arr ? arr.join(', ') : '[]');

  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator</h1>
        <div>
          <button onClick={() => fetchNumbers('p')} disabled={loading}>
            Prime
          </button>
          <button onClick={() => fetchNumbers('f')} disabled={loading}>
            Fibonacci
          </button>
          <button onClick={() => fetchNumbers('e')} disabled={loading}>
            Even
          </button>
          <button onClick={() => fetchNumbers('r')} disabled={loading}>
            Random
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {response && (
          <div className="results">
            <h3>Results</h3>
            <p>
              <strong>Previous Window State:</strong> {renderArray(response.windowPrevState)}
            </p>
            <p>
              <strong>Current Window State:</strong> {renderArray(response.windowCurrState)}
            </p>
            <p>
              <strong>Numbers from Server:</strong> {renderArray(response.numbers)}
            </p>
            <p>
              <strong>Average:</strong> {response.avg}
            </p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;