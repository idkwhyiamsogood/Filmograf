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
        var rawMovies = movies.ToList();
        var fetchMovies = new List<MovieRepo>();
        var moviesToInsert = new List<MovieRepo>();

        // получаем все уникальные имена и годы из входящего списка, чтобы проверить их одним запросом
        var names = rawMovies.Select(m => m.Name).Distinct().ToList();
        var years = rawMovies.Select(m => m.Year).Distinct().ToList();

        // вытягиваем из базы все фильмы, которые уже есть
        var existingMovies = await _movieRepository.GetByNamesAndYearsAsync(names, years);

        foreach (var movieData in rawMovies)
        {
            // Ищем в памяти среди загруженных из БД
            var realMovie = existingMovies.FirstOrDefault(x => 
                x.Name == movieData.Name && x.Year == movieData.Year);

            if (realMovie != null)
            {
                if (CheckIfEmptyFields(realMovie))
                    fetchMovies.Add(realMovie);
                continue;
            }

            // если в БД нет - создаем
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

            moviesToInsert.Add(newMovie);
            fetchMovies.Add(newMovie);
        }

        // вставка новых фильмов
        if (moviesToInsert.Any())
        {
            await _movieRepository.CreateManyAsync(moviesToInsert);
        }

        var request = new ParseFilmsDetailsIntegrationRequest
        { Source = source, Movies = fetchMovies.ToArray() };
        
        await _rabbitMqService.SendNoReplyAsync("parse_details", "movies_to_parser", request);
    }
}