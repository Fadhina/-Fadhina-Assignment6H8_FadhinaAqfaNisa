import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Search from "./components/Search";
import Movie from "./components/Movie";

const API_KEY = "2527d3b5"; // Ganti dengan API Key Anda
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState(() => {
    return localStorage.getItem("lastSearchQuery") || "harry potter"; // Ambil query terakhir dari localStorage
  });
  const [loading, setLoading] = useState(false); // Status loading
  const [error, setError] = useState(null); // Status error

  useEffect(() => {
    const savedMovies = localStorage.getItem("movies");
    if (savedMovies) {
      setMovies(JSON.parse(savedMovies)); // Ambil film dari localStorage
    } else {
      fetchMovies(query); // Fetch film jika localStorage kosong
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lastSearchQuery", query); // Simpan query terbaru ke localStorage
  }, [query]);

  const fetchMovies = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setMovies([]); // Jika query kosong, set movies menjadi array kosong
      return;
    }

    setLoading(true); // Mulai loading
    setError(null); // Reset error jika ada kesalahan sebelumnya

    try {
      const response = await fetch(`${API_URL}&s=${searchQuery}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }

      const data = await response.json();
      if (data.Search) {
        setMovies(data.Search); // Menampilkan daftar film
        localStorage.setItem("movies", JSON.stringify(data.Search)); // Simpan film ke localStorage
      } else {
        setMovies([]); // Jika tidak ada film, set menjadi array kosong
        localStorage.removeItem("movies"); // Hapus data film jika kosong
      }
    } catch (error) {
      setError(error.message); // Menyimpan pesan error
      setMovies([]); // Jika terjadi error, set movies menjadi array kosong
      localStorage.removeItem("movies"); // Hapus data film dari localStorage jika terjadi error
    } finally {
      setLoading(false); // Mengakhiri status loading
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery); // Mengubah query untuk pencarian baru
    fetchMovies(searchQuery); // Lakukan pencarian dengan query baru
  };

  return (
    <div>
      <Header title="Movies List Fadhina" />
      <Search onSearch={handleSearch} />

      {/* Menampilkan status loading atau error */}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {/* Tampilkan daftar film jika tersedia */}
      <div className="movies">
        {movies.length > 0
          ? movies.map((movie) => <Movie key={movie.imdbID} movie={movie} />)
          : !loading && (
              <p>No movies found. Try searching for something else.</p>
            )}
      </div>
    </div>
  );
}

export default App;
