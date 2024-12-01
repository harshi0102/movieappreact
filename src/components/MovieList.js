import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "./MovieCard";
import "./MovieList.css";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=9a20503c8daa59dffecb061d627eed62`
      );
      setMovies(response.data.results);
      setLoading(false);
    };

    fetchMovies();
  }, []);

  return (
    <div className="movie-list">
      {loading ? (
        <p>Loading movies...</p>
      ) : (
        movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
      )}
    </div>
  );
};

export default MovieList;
