import React, { useEffect, useState } from "react";

const MoviesTable = () => {
  const [movies, setMovies] = useState([]); // Stores all movies
  const [filteredMovies, setFilteredMovies] = useState([]); // Stores filtered movies
  const [searchTitle, setSearchTitle] = useState(""); // Stores title filter
  const [searchGenre, setSearchGenre] = useState(""); // Stores genre filter
  const [currentPage, setCurrentPage] = useState(1); // Tracks current page
  const itemsPerPage = 20; // Number of movies per page

  // Fetch movies once when the component mounts
  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/prust/wikipedia-movie-data/master/movies.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Function to filter movies
  useEffect(() => {
    // If searchTitle is empty AND searchGenre is empty, don't display anything
    if (searchTitle.trim() === "" && searchGenre === "") {
      setFilteredMovies([]);
      return;
    }

    let filtered = movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        (searchGenre === "" || movie.genres.includes(searchGenre))
    );

    setFilteredMovies(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchTitle, searchGenre, movies]);

  // Get current page movies
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Movie List</h1>

      {/* Search Filters */}
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by Title..."
          className="border p-2 w-1/2 rounded"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <select
          className="border p-2 rounded w-1/2"
          value={searchGenre}
          onChange={(e) => setSearchGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {[...new Set(movies.flatMap((movie) => movie.genres))].map(
            (genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            )
          )}
        </select>
      </div>

      {/* Display Table Only When Filtered Movies Exist */}
      {filteredMovies.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Thumbnail</th>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Year</th>
                  <th className="border p-2">Cast</th>
                  <th className="border p-2">Genres</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies
                  .slice(startIndex, startIndex + itemsPerPage)
                  .map((movie) => (
                    <tr key={movie.title} className="border-b">
                      <td className="border p-2">
                        {movie.thumbnail ? (
                          <img
                            src={movie.thumbnail}
                            alt={movie.title}
                            className="h-16 w-16 object-cover"
                          />
                        ) : (
                          "No Image"
                        )}
                      </td>
                      <td className="border p-2">{movie.title}</td>
                      <td className="border p-2">{movie.year}</td>
                      <td className="border p-2">{movie.cast.join(", ")}</td>
                      <td className="border p-2">{movie.genres.join(", ")}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2">{currentPage}</span>
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() =>
                setCurrentPage((prev) =>
                  startIndex + itemsPerPage < filteredMovies.length
                    ? prev + 1
                    : prev
                )
              }
              disabled={startIndex + itemsPerPage >= filteredMovies.length}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          No movies found. Please use the filters above.
        </p>
      )}
    </div>
  );
};

export default MoviesTable;
