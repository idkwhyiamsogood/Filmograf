using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService.Services;

public class MoviesService
{
    private readonly MovieRepository _movieRepository;
    private readonly MoviesCaching _moviesCaching;
    private readonly IMapper _mapper;
    public MoviesService(MovieRepository movieRepository, MoviesCaching moviesCaching, IMapper mapper)
    {
        _movieRepository = movieRepository;
        _moviesCaching = moviesCaching;
        _mapper = mapper;
    }

    public async Task<MovieResponseDto> MapMovieAsync(MovieRepo movieRepo)
    {
        var dto = _mapper.Map<MovieResponseDto>(movieRepo);

        var filmografRate = 10.0f;

        dto.Rates = new Dictionary<string, float>
        {
            { "IMDb", MathF.Round(movieRepo.RateIMDb, 1) },
            { "Kinopoisk", MathF.Round(movieRepo.RateKinopoisk, 1) },
            { "Film", filmografRate },
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
        return await GetMovieResponseAsync(movieId);
    }
}