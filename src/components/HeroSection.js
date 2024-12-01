import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import './HeroSection.css'; // Custom styling for the HeroSection

const HeroSection = () => {
  const [movies, setMovies] = useState([]); // Stores fetched movies
  const [filteredMovies, setFilteredMovies] = useState([]); // Stores filtered movies
  const [genres, setGenres] = useState([]); // Stores movie genres
  const [selectedCategory, setSelectedCategory] = useState('All'); // Selected category for filtering
  const [loading, setLoading] = useState(true); // Loading state for movies
  const [loadingGenres, setLoadingGenres] = useState(true); // Loading state for genres
  const [isNavOpen, setIsNavOpen] = useState(false); // State to toggle mobile navbar

  const categories = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance'];

  // Fetch both genres and movies when the component mounts
  useEffect(() => {
    setLoading(true);
    setLoadingGenres(true);
    fetchGenres(); // Fetch genres first
    fetchMovies(); // Fetch movies
  }, []);

  // Fetch genres from TMDB
  const fetchGenres = () => {
    const apiKey = '9a20503c8daa59dffecb061d627eed62'; // Correct TMDB API key

    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`)
      .then((response) => response.json())
      .then((data) => {
        setGenres(data.genres); // Set the genres
        setLoadingGenres(false); // Set genres loading to false
      })
      .catch((error) => {
        console.error('Error fetching genres:', error);
        setLoadingGenres(false);
      });
  };

  // Fetch movies from TMDB
  const fetchMovies = () => {
    const apiKey = '9a20503c8daa59dffecb061d627eed62'; // Correct TMDB API key

    // Fetch popular, trending, and latest movies
    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`),
      fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`),
      fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`),
    ])
      .then(async ([popularRes, trendingRes, latestRes]) => {
        const [popular, trending, latest] = await Promise.all([popularRes.json(), trendingRes.json(), latestRes.json()]);
        const allMovies = [...popular.results, ...trending.results, ...latest.results];
        setMovies(allMovies); // Set all movies
        setFilteredMovies(allMovies); // Initially, display all movies
        setLoading(false); // Set loading to false after movies are fetched
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  };

  // Handle category selection and filter movies
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    if (genres && genres.length > 0) {
      if (category === 'All') {
        setFilteredMovies(movies); // Show all movies
      } else {
        const categoryId = genres.find((genre) => genre.name.toLowerCase() === category.toLowerCase())?.id;

        if (categoryId) {
          setFilteredMovies(movies.filter((movie) => movie.genre_ids.includes(categoryId)));
        }
      }
    }
  };

  // Slick carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // Toggle the mobile navigation menu
  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Take only the first 3 movies for the carousel
  const topMovies = filteredMovies.slice(0, 3);

  // Show loading state if movies or genres are still loading
  if (loading || loadingGenres) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hero-container">
      {/* Navigation Bar */}
      <header className={`navbar ${isNavOpen ? 'open' : ''}`}>
        <div className="logo">MovieApp</div>
        <div className="hamburger" onClick={toggleNav}>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <nav className="nav-links">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#movies">Movies</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className={`nav-links-mobile ${isNavOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#movies">Movies</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </header>

      {/* Carousel */}
      <Slider {...settings}>
        {topMovies.map((movie) => (
          <div key={movie.id} className="hero-slide">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/original/${movie.poster_path}` : 'https://via.placeholder.com/500x750'}
              alt={movie.title}
              className="hero-image"
            />
            <div className="hero-content">
              <h2>{movie.title}</h2>
            </div>
          </div>
        ))}
      </Slider>

      {/* Filters and Search Bar */}
      <div className="filters">
        <select
          className="category-filter"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Movie List Below Carousel */}
      <div className="movie-list">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : 'https://via.placeholder.com/500x750'}
              alt={movie.title}
              className="movie-image"
            />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
