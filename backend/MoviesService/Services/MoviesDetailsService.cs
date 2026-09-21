using Filmograf.BaseLibrary.DataAccess.Repositories;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;
using Filmograf.MoviesService.Caching;

namespace Filmograf.MoviesService.Services;

public class MoviesDetailsService
{
    private readonly MovieRepository _movieRepository;
    private readonly GenresService _genresService;
    private readonly MoviesCaching _moviesCaching;
    
    public MoviesDetailsService(MovieRepository movieRepository, GenresService genresService, MoviesCaching moviesCaching)
    {
        _movieRepository = movieRepository;
        _genresService = genresService;
        _moviesCaching = moviesCaching;
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
            await _moviesCaching.RemoveCachingAsync(movie.Id);
        }
    }

    public async Task ApplyOneMovieDetailsAsync(string movieId, RawMovieInfo info)
    {
        var movie = await _movieRepository.GetByIdAsync(movieId);
        if (movie == null) throw new NotFoundHttpException("MovieNotFound");
        
        var genres = await _genresService
            .EnsureGenresAsync(info.Genres.ToArray());

        movie.Name = info.Name;
        movie.Description = info.Description;
        movie.Year = info.Year;
        movie.AgeLimit = info.AgeLimit;
        movie.Time = info.Time;
        movie.ImageUrl = info.ImageUrl;
        movie.PreviewImageUrl = info.PreviewImageUrl;
        movie.GenreIds = genres.Select(i => i.Id).ToArray();

        await _movieRepository.UpdateAsync(movie.Id, movie);
        await _moviesCaching.RemoveCachingAsync(movie.Id);
    }
}