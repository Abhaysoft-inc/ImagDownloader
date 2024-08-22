
import './App.css'

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [startIndex, setStartIndex] = useState(1);

  const handleSearch = async (e, isLoadMore = false) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/search?q=${query}&start=${startIndex}`);
      if (isLoadMore) {
        setImages((prevImages) => [...prevImages, ...response.data]); // Append new results
      } else {
        setImages(response.data); // Set new results
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const loadMoreImages = () => {
    setStartIndex((prevStartIndex) => prevStartIndex + 10); // Increment start index by 10
    handleSearch({ preventDefault: () => { } }, true); // Load more images
  };

  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg'; // Customize the file name and extension if needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <h1>Image Search</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images..."
        />
        <button type="submit">Search</button>
      </form>
      <div className="image-grid">
        {images.map((image) => (
          <div key={image.link} className="image-item">
            <img
              src={image.image.thumbnailLink} // Use the thumbnail image
              alt={image.title}
              loading="lazy"
            />
            <button onClick={() => downloadImage(image.link)}>Download</button>
          </div>
        ))}
      </div>
      {images.length > 0 && (
        <button onClick={loadMoreImages}>Load More</button>
      )}
    </div>
  );
}

export default App;
