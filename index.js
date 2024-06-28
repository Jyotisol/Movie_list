const fetchMovieBtn = document.getElementById("fetchMovie");
const sortMoviesBtn = document.getElementById("sortMovies");
const applyFiltersBtn = document.getElementById("applyFilters");
const movieInput = document.getElementById("movieInput");
const movieResults = document.getElementById("movieResults");


const filterYearSelect = document.getElementById("filterYear");
const filterGenreSelect = document.getElementById("filterGenre");
const filterLanguageSelect = document.getElementById("filterLanguage");


const API_KEY = "b3f0cf09";
let movies = [];


document.addEventListener("DOMContentLoaded", () => {
  fetchMovies("ram");
});


// movies will be shown based on the input value , trim used nelecting unnecessary used spaces
fetchMovieBtn.addEventListener("click", () => {
  fetchMovies(movieInput.value.trim());
});




// movies will be short based on given condition by default used A-Z form short
sortMoviesBtn.addEventListener("click", sortMovies);


// movies will fill on based Genre,Language and year relase .
applyFiltersBtn.addEventListener("click", applyFilters);




// fetch movies with help of async await modern es8
async function fetchMovies(movieTitle) {
  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${movieTitle}&apikey=${API_KEY}`);


    const data = await response.json();
   
    console.log(data);


    if (data.Response === "True") {
      movies = await Promise.all(data.Search.map(async movie => {
        const detailsResponse = await fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${API_KEY}`);
        const detailsData = await detailsResponse.json();
        return { ...movie, Genre: detailsData.Genre, Language: detailsData.Language, Year: detailsData.Year };
      }));
      populateFilters();
      displayMovies(movies);
    } else {
      movieResults.innerHTML = '<p>Movie not found.</p>';
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    movieResults.innerHTML = '<p>Something went wrong</p>';
  }
}


function populateFilters() {
  const years = [...new Set(movies.map(movie => movie.Year))].sort();
  const genres = [...new Set(movies.map(movie => movie.Genre.split(', ')).flat())].sort();


  filterYearSelect.innerHTML = '<option class="option" value=""></option>' + years.map(year => `<option value="${year}">${year}</option>`).join('');
  filterGenreSelect.innerHTML = '<option value=""></option>' + genres.map(genre => `<option value="${genre}">${genre}</option>`).join('');
}


function displayMovies(movies) {
  const moviesHTML = movies.map(movie => `
    <div class="movie" data-id="${movie.imdbID}"> <img src="${movie.Poster}" alt="${movie.Title} Poster"><h3>${movie.Title}</h3><h4>${movie.Year}</h4>
      <p>Genre: ${movie.Genre}</p> <p>Lang: ${movie.Language}</p>
    </div>
  `).join("");


  movieResults.innerHTML = moviesHTML;


  // Event listeners to each movie card for details
  document.querySelectorAll('.movie').forEach(movieDiv => {
    movieDiv.addEventListener('click', function() {
      const movieID = this.getAttribute('data-id');
      localStorage.setItem('selectedMovieID', movieID);
      window.location.href = 'movie.html';
    });
  });
}


function sortMovies() {
  movies.sort((a, b) => a.Title.localeCompare(b.Title));
  displayMovies(movies);
}


function applyFilters() {
  let filteredMovies = movies;


  const selectedYear = filterYearSelect.value;
  const selectedGenre = filterGenreSelect.value;
  const selectedLanguage = filterLanguageSelect.value;


  if (selectedYear) {
    filteredMovies = filteredMovies.filter(movie => movie.Year === selectedYear);
  }
  if (selectedGenre) {
    filteredMovies = filteredMovies.filter(movie => movie.Genre.includes(selectedGenre));
  }
  if (selectedLanguage) {
    filteredMovies = filteredMovies.filter(movie => movie.Language === selectedLanguage);
  }


  displayMovies(filteredMovies);
}
