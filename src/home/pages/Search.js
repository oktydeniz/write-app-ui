import React, { useState } from "react";

function Search() {
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
}

export default Search;