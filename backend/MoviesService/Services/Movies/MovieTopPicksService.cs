using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Repo;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.BaseLibrary.Services;
using Filmograf.BaseLibrary.Util;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService.Services.Movies;

public class MovieTopPicksService
{
    private readonly MoviesParserService _moviesParserService;
    private readonly MovieRepository _movieRepository;
    private readonly TopPicksService _topPicksService;
    
    public MovieTopPicksService(MoviesParserService moviesParserService, MovieRepository movieRepository, 
        TopPicksService topPicksService)
    {
        _moviesParserService = moviesParserService;
        _movieRepository = movieRepository;
        _topPicksService = topPicksService;
    }
    
    public async Task<EntitiesListResponseDto> GetFromChartAsync(PaginationQueryDto pagination, string chartType = "IMDb")
    {
        await _moviesParserService.CheckLastParsingAsync(chartType);
        return await _topPicksService.GetFromChartAsync(pagination, chartType);
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

        
    }
}