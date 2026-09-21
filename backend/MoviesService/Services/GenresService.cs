using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.MoviesService.Caching;
using Filmograf.MoviesService.Models.Dto;

namespace Filmograf.MoviesService.Services;

public class GenresService
{
    private readonly GenreCaching _genreCaching;
    private readonly GenreProvider _genreProvider;

    public GenresService(GenreCaching genreCaching, GenreProvider genreProvider)
    {
        _genreCaching = genreCaching;
        _genreProvider = genreProvider;
    }

    private async Task<IEnumerable<Genre>> CreateCacheForAllAsync()
    {
        return await _genreProvider.ListAllAsync();
    }

    public async Task<IEnumerable<Genre>> ListAllAsync()
    {
        var method = async () => await CreateCacheForAllAsync();
        return await _genreCaching.CachingAllAsync(method);
    }

    public async Task<Genre> CreateGenreAsync(CreateGenreRequestDto data)
    {
        var newGenreBase = data.CreateBase();
        var newGenre = await _genreProvider.AddAsync(newGenreBase);

        if (newGenre == null) throw new InternalServerErrorHttpException(
            "CreateGenreError", "Error on create an new genre");

        await _genreCaching.RemoveCachingAllAsync();
        return newGenre;
    }

    public async Task<Genre> EnsureGenreAsync(string genreName)
    {
        var exitingGenre = await _genreProvider.GetByNameAsync(genreName);
        if (exitingGenre != null) return exitingGenre;

        var newGenreEntity = new Genre { Name = genreName };
        var newGenre = await _genreProvider.AddAsync(newGenreEntity);
        
        if (newGenre == null) throw new InternalServerErrorHttpException(
            "CreateGenreError", "Error on create an new genre");

        return newGenre;
    }
    
    public async Task<IEnumerable<Genre>> EnsureGenresAsync(string[] genreNames)
    {
        List<Genre> genres = new List<Genre>();

        foreach (var name in genreNames)
        {
            var genre = await EnsureGenreAsync(name);
            genres.Add(genre);
        }

        return genres;
    }
}