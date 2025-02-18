const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
      <input
        type="text"
        placeholder="Zoek een coin..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    );
  };
  
  export default SearchBar;
  