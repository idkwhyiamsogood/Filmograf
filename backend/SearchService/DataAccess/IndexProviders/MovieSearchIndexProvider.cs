using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;
using Filmograf.BaseLibrary.Models.SearchIndexes;
using Filmograf.SearchService.Models.Dto;

namespace Filmograf.SearchService.DataAccess.IndexProviders;

public class MovieSearchIndexProvider
{
    private const string IndexName = "movies";
    private readonly ElasticsearchClient _elasticsearch;
    
    public MovieSearchIndexProvider(ElasticsearchClient elasticsearch)
    {
        _elasticsearch = elasticsearch;
    }

    public async Task<List<string>> SearchWithFiltersAsync(string query, MovieSearchRequestDto? filters, 
        bool allowFuzziness = true, CancellationToken ct = default)
    {
        var mustQueries = new List<Query>();
        var filterQueries = new List<Query>();
        var mustNotQueries = new List<Query>();

        // поиск по имени (Must)
        if (!string.IsNullOrWhiteSpace(query))
        {
            // В v8 Field указывается прямо в конструкторе или через инициализатор
            mustQueries.Add(new MatchQuery(Infer.Field<MovieSearchIndex>(f => f.Name)) 
            { 
                Field = Infer.Field<MovieSearchIndex>(f => f.Name), // Дублируем сюда явно
                Query = query, 
                Fuzziness = allowFuzziness ? new Fuzziness("AUTO") : null 
            });
        }

        if (filters != null)
        {
            // включаемые жанры (Include)
            if (filters.Genres?.Include?.Any() == true)
            {
                if (filters.StrictMatch)
                {
                    foreach (var genreId in filters.Genres.Include)
                    {
                        // используем Infer.Field для типизированного доступа или просто строку
                        filterQueries.Add(new TermQuery(Infer.Field<MovieSearchIndex>(f => f.GenreIds)) 
                        { 
                            Field = Infer.Field<MovieSearchIndex>(f => f.GenreIds), // Явное указание
                            Value = genreId.ToString() 
                        });
                    }
                }
                else
                {
                    var includeValues = filters.Genres.Include.Select(g => FieldValue.String(g.ToString())).ToList();
                    filterQueries.Add(new TermsQuery
                    {
                        Field = Infer.Field<MovieSearchIndex>(f => f.GenreIds),
                        Terms = new TermsQueryField(includeValues.ToArray())
                    });
                }
            }

            // исключаемые жанры (Exclude)
            if (filters.Genres?.Exclude?.Any() == true)
            {
                var excludeValues = filters.Genres.Exclude.Select(g => FieldValue.String(g.ToString())).ToList();
                mustNotQueries.Add(new TermsQuery
                {
                    Field = Infer.Field<MovieSearchIndex>(f => f.GenreIds),
                    Terms = new TermsQueryField(excludeValues.ToArray())
                });
            }

            // года (FromYearTo)
            if (filters.FromYearTo?.Length == 2 && int.TryParse(filters.FromYearTo[0], out int yearFrom) && int.TryParse(filters.FromYearTo[1], out int yearTo))
            {
                // RangeQuery теперь разделен на типы. Для чисел используем NumberRangeQuery
                filterQueries.Add(new NumberRangeQuery(Infer.Field<MovieSearchIndex>(f => f.Year))
                {
                    Gte = yearFrom,
                    Lte = yearTo
                });
            }

            // оценки IMDb (FromGradeTo)
            if (filters.FromGradeTo?.Length == 2)
            {
                filterQueries.Add(new NumberRangeQuery(Infer.Field<MovieSearchIndex>(f => f.RateIMDb))
                {
                    Gte = (double)filters.FromGradeTo[0],
                    Lte = (double)filters.FromGradeTo[1]
                });
            }

            // возрастной рейтинг (AgeRating - In)
            if (filters.AgeRating?.Any() == true)
            {
                var ageValues = filters.AgeRating.Select(a => FieldValue.Double(a)).ToList();
                filterQueries.Add(new TermsQuery
                {
                    Field = Infer.Field<MovieSearchIndex>(f => f.AgeLimit),
                    Terms = new TermsQueryField(ageValues.ToArray())
                });
            }
        }

        var response = await _elasticsearch.SearchAsync<MovieSearchIndex>(s => s
            .Index(IndexName)
            .Query(q => q
                .Bool(b => b
                    .Must(mustQueries.ToArray())
                    .Filter(filterQueries.ToArray())
                    .MustNot(mustNotQueries.ToArray())
                )
            )
            .Size(100)
            .SourceIncludes(Infer.Fields<MovieSearchIndex>(f => f.Id)) 
        );

        if (!response.IsSuccess())
        {
            // todo: оггирование ошибки
            return new List<string>();
        }

        return response.Documents.Select(d => d.Id).ToList();
    }
    
    public async Task<List<string>> SearchMoviesAsync(string query, bool allowFuzziness = true, CancellationToken ct = default)
    {
        var response = await _elasticsearch.SearchAsync<MovieSearchIndex>(s => s
            .Index(IndexName)
            .Query(q => q
                .Match(m => m
                        .Field(f => f.Name)
                        .Query(query)
                        .Fuzziness(allowFuzziness ? new Fuzziness("AUTO") : null) // прощает опечатки!
                )
            ),
            cancellationToken: ct
        );

        return response.Documents.Select(i => i.Id).ToList();
    }
}