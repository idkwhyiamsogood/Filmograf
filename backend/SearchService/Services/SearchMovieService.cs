using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.SearchService.Caching;

namespace Filmograf.SearchService.Services;

public class SearchMovieService
{
    private readonly MovieRepository _movieRepository;
    private readonly CollectionRepository _collectionRepository;
    private readonly CollectionTagProvider _tagProvider; 
    private readonly GenreProvider _genreProvider; 
    private readonly SearchParsingService _searchParsingService;
    private readonly SearchCaching _searchCaching;

    
    public SearchMovieService(MovieRepository movieRepository, CollectionTagProvider tagProvider, 
        GenreProvider genreProvider, SearchParsingService searchParsingService, SearchCaching searchCaching)
    {
        _movieRepository = movieRepository;
        _tagProvider = tagProvider;
        _genreProvider = genreProvider;
        _searchParsingService = searchParsingService;
        _searchCaching = searchCaching;
    }
    
    private async Task HandleSearchParsingAsync(string query, string roomId)
    {
        await _searchParsingService.ParseSearchAsync(query, roomId);
    }
    
    
}