using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Integration.Requested;

namespace Filmograf.MoviesService.Services;

public class MoviesDistinctService
{
    private readonly MovieRepository _movieRepository;
    private readonly IRabbitMqRequestedService _rabbitMqService;
    private readonly TopPicksRepository _topPicksRepository;
    
    public MoviesDistinctService(MovieRepository movieRepository, IRabbitMqRequestedService rabbitMqService,
        TopPicksRepository topPicksRepository)
    {
        _movieRepository = movieRepository;
        _rabbitMqService = rabbitMqService;
        _topPicksRepository = topPicksRepository;
    }

    private bool CheckIfEmptyFields(MovieRepo movieData)
    {
        if (NullableUtil.AnyIsNull(movieData.Description, movieData.GenreIds, movieData.ImageUrl))
            return true;
        
        if (movieData.GenreIds == null || !movieData.GenreIds.Any())
            return true;
        
        if (movieData.Description == "Описание не найдено")
            return true;
        
        if (movieData.ImageUrl == "Не найдена")
            return true;

        return false;
    }
    

    private async Task CheckMovieAsync(RawMovieInfo movieData, List<MovieRepo> fetchMovies)
    {
        var realMovie = await _movieRepository.GetByNameAndYearAsync(movieData.Name, movieData.Year);
        
        if (realMovie != null)
        {
            if (CheckIfEmptyFields(realMovie))
                fetchMovies.Add(realMovie);
            
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
        fetchMovies.Add(newMovie);
    }

    public async Task DistinctMoviesAsync(string source, IEnumerable<RawMovieInfo> movies)
    {
        // тут будут лежать фильмы, у которых нужно дополнительно инфу спарсить
        // ну условно: жанры, описание и фотокарточка фулл качества - это только на странице отдельного фильма
        List<MovieRepo> fetchMovies = new List<MovieRepo>();

        foreach (var movie in movies)
        {
             await CheckMovieAsync(movie, fetchMovies);
        }

        var request = new ParseFilmsDetailsIntegrationRequest
        { Source = source, Movies = fetchMovies.ToArray() };
        
        await _rabbitMqService.SendNoReplyAsync("parse_details", "movies_to_parser", request);
    }
}