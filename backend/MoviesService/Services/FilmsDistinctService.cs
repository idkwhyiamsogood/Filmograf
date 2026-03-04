using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.MoviesService.Services;

public class FilmsDistinctService
{
    private readonly MovieRepository _movieRepository;
    
    public FilmsDistinctService(MovieRepository movieRepository)
    {
        _movieRepository = movieRepository;
    }

    private async Task CheckMovieAsync(RawMovieInfo movieData, List<string> fetchMovies)
    {
        var realMovie = await _movieRepository.GetByNameAndYearAsync(movieData.Name, movieData.Year);
        
        if (realMovie != null)
        {
            if (!NullableUtil.AnyIsNull(realMovie.Description, realMovie.GenreIds, realMovie.ImageUrl))
                fetchMovies.Add(realMovie.Id);
            
            return;
        }

        var newMovie = new MovieRepo
        {
            Id = MongoDbUtil.GenerateNewId(),
            Name = movieData.Name,
            Description = movieData.Description,
            Year = movieData.Year,
            AgeLimit = movieData.AgeLimit,
            Time = movieData.Time,
            ImageUrl = movieData.ImageUrl,
            MovieLink = movieData.MovieLink,
            RateIMDb = movieData.Rate,
            GenreIds = null
        };

        await _movieRepository.CreateAsync(newMovie);
        fetchMovies.Add(realMovie.Id);
    }
    
    public async Task DistinctMoviesAsync(IEnumerable<RawMovieInfo> movies)
    {
        // тут будут лежать фильмы, у которых нужно дополнительно инфу спарсить
        // ну условно: жанры, описание и фотокарточка фулл качества - это только на странице отдельного фильма
        List<string> fetchMovies = new List<string>();

        foreach (var movie in movies)
        {
            await CheckMovieAsync(movie, fetchMovies);
        }
        
        
    }
}