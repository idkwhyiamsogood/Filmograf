using AutoMapper;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService.Services.MovieRates;

public class MovieRateService
{
    private readonly MovieRateCaching _movieRateCaching;
    private readonly MovieRateRepository _movieRateRepository;
    private readonly MoviesCaching _moviesCaching;
    private readonly IMapper _mapper;
    
    public MovieRateService(MovieRateCaching movieRateCaching, MovieRateRepository movieRateRepository, IMapper mapper,
        MoviesCaching moviesCaching)
    {
        _movieRateCaching = movieRateCaching;
        _movieRateRepository = movieRateRepository;
        _mapper = mapper;
        _moviesCaching = moviesCaching;
    }

    private async Task<IEnumerable<MovieRateResponseDto>> CreateCacheForUserAllAsync(Guid userId)
    {
        var data = await _movieRateRepository.GetUserRatesAsync(userId);
        return _mapper.Map<MovieRateResponseDto[]>(data);
    }

    public async Task<IEnumerable<MovieRateResponseDto>> ListByUserAsync(Guid userId)
    {
        var method = async () => await CreateCacheForUserAllAsync(userId);
        return await _movieRateCaching.CachingUserAllAsync(userId, method);
    }
    
    
    private async Task<IEnumerable<MovieRateResponseDto>> CreateCacheForMovieAsync(string movieId)
    {
        var data = await _movieRateRepository.GetMovieRatesAsync(movieId);
        return _mapper.Map<MovieRateResponseDto[]>(data);
    }

    public async Task<IEnumerable<MovieRateResponseDto>> ListByMovieAsync(string movieId)
    {
        var method = async () => await CreateCacheForMovieAsync(movieId);
        return await _movieRateCaching.CachingByMovieAsync(movieId, method);
    }

    public async Task<float> CalcRateForMovieAsync(string movieId)
    {
        var movieRates = await ListByMovieAsync(movieId);
        if (movieRates == null || !movieRates.Any()) return -1;

        return (float) movieRates.Average(m => m.Rate);
    }


    private async Task<MovieRateRepo> CreateCacheForUserAsync(Guid userId, string movieId)
    {
        var userRate = await _movieRateRepository.GetByUserAndMovieAsync(userId, movieId);
        if (userRate == null) throw new NotFoundHttpException("NotFound", 
            $"Rate for movie with id={movieId} by user with id={userId} not found.");

        return userRate;
    }

    public async Task<MovieRateRepo?> GetByUserAsync(Guid userId, string movieId)
    {
        try
        {
            var method = async () => await CreateCacheForUserAsync(userId, movieId);
            return await _movieRateCaching.CachingUserMovieAsync(userId, movieId, method);
        }
        catch (NotFoundHttpException nfex)
        {
            return null;
        }
    }

    public async Task DeleteCacheForUserAsync(Guid userId, string movieId)
    {
        await Task.WhenAll 
        (
            _movieRateCaching.RemoveCachingUserAllAsync(userId),
            _movieRateCaching.RemoveCachingByMovieAsync(movieId),
            _movieRateCaching.RemoveCachingUserMovieAsync(userId, movieId)
        );
    }

    public async Task RateMovieAsync(string movieId, Guid userId, int rate)
    {
        // чекаем текущую оценку
        var userRate = await _movieRateRepository.GetByUserAndMovieAsync(userId, movieId);
            
        // если есть оценка и мы пытаемся поставить ту же - ливаем
        if (userRate != null && userRate.Rate == rate) return;

        // если была установлена оценка
        if (userRate != null)
        {
            userRate.Rate = rate;
            await _movieRateRepository.UpdateAsync(userRate.Id, userRate);
            
            // удаляем кеш
            await DeleteCacheForUserAsync(userId, movieId);
            
            // удаляем кеш отдлельного фильма
            await _moviesCaching.RemoveCachingAsync(movieId);
            
            return;
        }
        
        // иначе просто поставим оценку
        var newRate = new MovieRateRepo
        {
            Id = MongoDbUtil.GenerateNewId(),
            UserId = userId, 
            MovieId = movieId, 
            Rate = rate
        };
        
        await _movieRateRepository.CreateAsync(newRate);
        
        // удаляем кеш
        await DeleteCacheForUserAsync(userId, movieId);
            
        // удаляем кеш отдлельного фильма
        await _moviesCaching.RemoveCachingAsync(movieId);
    }
}