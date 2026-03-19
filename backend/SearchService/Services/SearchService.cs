using System.Runtime.CompilerServices;
using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.SearchService.Models.Dto;

namespace Filmograf.SearchService.Services;

public class SearchService
{
    
    private readonly MovieRepository _movieRepository;
    private readonly CollectionRepository _collecRepository;
    
    
    public SearchService(MovieRepository movieRepository, CollectionRepository collecRepository)
    {
        _movieRepository = movieRepository;
        _collecRepository = collecRepository;
    }
    
    public async Task<SearchResponseDto> SearchAsync(string query)
    {
        var moviesTask = _movieRepository.GetByNameAsync(query);
        var collectionsTask = _collecRepository.GetByNameAsync(query);
        
        await Task.WhenAll(moviesTask, collectionsTask);
        
        var movies = await moviesTask;
        var collections = await collectionsTask;
        
        var sortedMovies = movies
            .Select(m => new
            {
                Movie = m,
                Index = m.Name.IndexOf(query, StringComparison.OrdinalIgnoreCase)
            })
            .Where(x => x.Index >= 0) // Оставляем только те, где запрос найден
            .OrderBy(x => x.Index) // Сначала те, у которых запрос раньше
            .ThenBy(x => x.Movie.Name.Length) // При равной позиции - более короткие названия
            .Select(x => x.Movie)
            .ToList();
        
        var sortedCollections = collections
            .Select(m => new
            {
                Movie = m,
                Index = m.Name.IndexOf(query, StringComparison.OrdinalIgnoreCase)
            })
            .Where(x => x.Index >= 0)
            .OrderBy(x => x.Index) 
            .ThenBy(x => x.Movie.Name.Length) 
            .Select(x => x.Movie)
            .ToList();
        
        var response = new SearchResponseDto
        {
            Parts = new[]
            {
                new SearchPartResponseDto
                {
                    Type = SearchPartType.Movie,
                    EntityIds = sortedMovies.Select(m => m.Id).ToArray()
                },
                new SearchPartResponseDto
                {
                    Type = SearchPartType.Collection,
                    EntityIds = sortedCollections.Select(c => c.Id).ToArray()
                }
            }
        };
        
        return response;
    }
}