import React, { useState } from "react";

function Search({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
    } else {
      alert("Please enter a search query.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search">
      <input
        type="text"
        placeholder="Search for movies..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default Search;
