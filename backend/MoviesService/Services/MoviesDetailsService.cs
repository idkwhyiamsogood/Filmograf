using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.MoviesService.Services;

public class MoviesDetailsService
{
    private readonly MovieRepository _movieRepository;
    private readonly GenresService _genresService;
    
    public MoviesDetailsService(MovieRepository movieRepository, GenresService genresService)
    {
        _movieRepository = movieRepository;
        _genresService = genresService;
    }

    public async Task ApplyDetailsAsync(MovieDetailsParseResult[] detailsInfo)
    {
        foreach (var item in detailsInfo)
        {
            var movie = await _movieRepository.GetByIdAsync(item.Id);
            if (movie == null) continue;

            var genres = await _genresService
                .EnsureGenresAsync(item.Genres.ToArray());

            movie.ImageUrl = item.ImageUrl;
            movie.PreviewImageUrl = item.PreviewImageUrl;
            movie.Description = item.Description;
            movie.GenreIds = genres.Select(i => i.Id).ToArray();

            await _movieRepository.UpdateAsync(movie.Id, movie);
        }
    }
}