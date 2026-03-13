using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService.Services.Movies;

public class MovieTopPicksService
{
    private readonly MoviesParserService _moviesParserService;
    private readonly TopPicksRepository _topPicksRepository;
    private readonly MovieRepository _movieRepository;
    private readonly MoviesCaching _moviesCaching;
    private readonly MoviesService _moviesService;
    
    public MovieTopPicksService(MoviesParserService moviesParserService, TopPicksRepository topPicksRepository, 
        MovieRepository movieRepository, MoviesCaching moviesCaching, MoviesService moviesService)
    {
        _moviesParserService = moviesParserService;
        _topPicksRepository = topPicksRepository;
        _movieRepository = movieRepository;
        _moviesCaching = moviesCaching;
        _moviesService = moviesService;
    }
    
    private async Task<MoviesListResponseDto> CreateCacheForChartAsync(PaginationQueryDto pagination, string chartType)
    {
        var chartRepo = await _topPicksRepository.GetByChartTypeAsync(chartType);
        if (chartRepo == null) return new MoviesListResponseDto();
        
        var sortedChartIds = chartRepo.Chart
            .OrderBy(pair => pair.Key)
            .Select(pair => pair.Value)
            .ToList();
        
        var pagedIds = sortedChartIds
            .Skip(pagination.Page * pagination.Count)
            .Take(pagination.Count)
            .ToList();
        
        if (!pagedIds.Any()) return new MoviesListResponseDto();

        return new MoviesListResponseDto { Ids = pagedIds.ToArray() };
    }

    // chartType: 'IMDb', 'Kinopoisk'
    public async Task<MoviesListResponseDto> GetFromChartAsync(PaginationQueryDto pagination, string chartType = "IMDb")
    {
        await _moviesParserService.CheckLastParsingAsync(chartType);

        var method = async () => await CreateCacheForChartAsync(pagination, chartType);
        return await _moviesCaching.CachingTopPickAsync(chartType, pagination, method);
    }
    
    public async Task UpdateMoviesChartAsync(string chartType, IEnumerable<RawMovieInfo> movies)
    {
        var sortedMovies = movies
            .Where(m => m.ChartIndex.HasValue)
            .OrderBy(m => m.ChartIndex.Value)
            .ToList();

        var chartDictionary = new Dictionary<int, string>();
        int currentNewIndex = 1; // новая нумерацию с 1

        foreach (var movie in sortedMovies)
        {
            var realMovie = await _movieRepository.GetByNameAndYearAsync(movie.Name, movie.Year);
            if (realMovie == null) continue;
            
            // счетчик вместо исходного ChartIndex, дабы избежать пропусков
            chartDictionary.Add(currentNewIndex, realMovie.Id);
            currentNewIndex++;
        }

        // получаем существующий топик
        var exitingTopPick = await _topPicksRepository.GetByChartTypeAsync(chartType);
        
        // если нету
        if (exitingTopPick == null)
        {
            // создаем новый
            var newTopPick = new TopPicksRepo
            {
                Id = MongoDbUtil.GenerateNewId(),
                ChartType = chartType, 
                Chart = chartDictionary
            };

            // сохраняем
            await _topPicksRepository.CreateAsync(newTopPick);
            await _moviesCaching.RemoveCachingTopPickRootAsync(chartType);
            return;
        }

        // если уже есть запись для такого топика - обновляем данные
        exitingTopPick.Chart = chartDictionary;
        await _topPicksRepository.UpdateAsync(exitingTopPick.Id, exitingTopPick);
        
        // удяляем фулл кеш для топика
        await _moviesCaching.RemoveCachingTopPickRootAsync(chartType);
    }
}