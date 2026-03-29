using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Integrations.Requested;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Integration.Requested;

namespace Filmograf.MoviesService.Services;

public class SearchParsingReceiverService
{
    private readonly MovieRepository _movieRepository;
    private readonly IRabbitMqRequestedService _rabbitMqService;
    
    public SearchParsingReceiverService(MovieRepository movieRepository, IRabbitMqRequestedService rabbitMqService)
    {
        _movieRepository = movieRepository;
        _rabbitMqService = rabbitMqService;
    }
    
    public async Task<IEnumerable<string>> DistinctMoviesAsync(string targetRoomId, IEnumerable<RawMovieInfo> movies)
    {
        var result = new List<string>();
        var rawMovies = movies.ToList();
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
                result.Add(realMovie.Id);
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
            result.Add(newMovie.Id);
        }

        // вставка новых фильмов
        if (moviesToInsert.Any())
        {
            await _movieRepository.CreateManyAsync(moviesToInsert);
        }

        var request = new ReceiveParsingResultIntegrationRequest
        { TargetRoomId = targetRoomId, MovieIds = result.ToArray() };
        
        await _rabbitMqService.SendNoReplyAsync("apply_search_parsing", "movies_to_search", request);

        return result;
    }
}