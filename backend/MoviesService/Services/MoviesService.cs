using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Dto;
using Filmograf.MoviesService.Services.MovieRates;

namespace Filmograf.MoviesService.Services;

public class MoviesService
{
    private readonly MovieRepository _movieRepository;
    private readonly MoviesCaching _moviesCaching;
    private readonly IMapper _mapper;
    private readonly MovieRateService _movieRateService;
    private readonly ClickEntityService _clickEntityService;
    
    public MoviesService(MovieRepository movieRepository, MoviesCaching moviesCaching, MovieRateService movieRateService, 
        IMapper mapper, ClickEntityService clickEntityService)
    {
        _movieRepository = movieRepository;
        _moviesCaching = moviesCaching;
        _movieRateService = movieRateService;
        _mapper = mapper;
        _clickEntityService = clickEntityService;
    }

    public async Task<MovieResponseDto> MapMovieAsync(MovieRepo movieRepo)
    {
        var dto = _mapper.Map<MovieResponseDto>(movieRepo);

        var filmografRate = await _movieRateService.CalcRateForMovieAsync(movieRepo.Id);

        dto.Rates = new Dictionary<string, float>
        {
            { "IMDb", MathF.Round(movieRepo.RateIMDb, 1) },
            { "Kinopoisk", MathF.Round(movieRepo.RateKinopoisk, 1) },
            { "Film", MathF.Round(filmografRate, 1) },
        };

        return dto;
    }

    private async Task<MovieResponseDto> CreateCacheForMovieResponseAsync(string movieId)
    {
        var movie = await _movieRepository.GetByIdAsync(movieId);
        if (movie == null) throw new NotFoundHttpException("MovieNotFound", $"Movie with id={movieId} not found.");

        return await MapMovieAsync(movie);
    }

    public async Task<MovieResponseDto> GetMovieResponseAsync(string movieId)
    {
        var method = async () => await CreateCacheForMovieResponseAsync(movieId);
        return await _moviesCaching.CachingAsync(movieId, method);
    }

    // todo: caching
    public async Task<IEnumerable<MovieResponseDto>> ListManyMovieResponsesAsync(IEnumerable<string> ids)
    {
        List<MovieResponseDto> outputValue = new List<MovieResponseDto>();

        foreach (var id in ids)
        {
            var movie = await GetMovieResponseAsync(id);
            outputValue.Add(movie);
        }

        return outputValue;
    }

    public async Task<IEnumerable<MovieResponseDto>> GetFilmografTopAsync(string chartType)
    {
        throw new NotImplementedException();
    }

    public async Task<MovieResponseDto> GetByUserAsync(string movieId, User user)
    {
        var sendClickRequestTask = _clickEntityService.CheckEntityClickAsync("Movie", movieId, user.Id);
        var movieRateTask = _movieRateService.GetByUserAsync(user.Id, movieId);
        var movieResponseTask = GetMovieResponseAsync(movieId);

        await Task.WhenAll(movieRateTask, movieResponseTask);
        var movieRate = movieRateTask.Result;
        var movieResponse = movieResponseTask.Result;

        movieResponse.Rates["ByUser"] = movieRate?.Rate ?? -1;
        await sendClickRequestTask;
        return movieResponse;
    }
}