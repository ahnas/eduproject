import React from 'react';

const SearchResultsWidget = ({ data }) => {
  return (
    <div>
      <h3>Search Results:</h3>
      <ul>
        {data.map((result, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <a href={result.link} target="_blank" rel="noopener noreferrer">
              {result.title}
            </a>
            <p>{result.snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResultsWidget;
