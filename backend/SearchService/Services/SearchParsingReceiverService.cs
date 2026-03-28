using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.SearchService.Services;

public class SearchParsingReceiverService
{
    public SearchParsingReceiverService()
    {
        
    }

    // todo
    // тут короче когда парсинг сервайс завершит поиск на сайте - отправиться запрос на SearchService и он перехватиться здесь
    public async Task HandleParsingResultAsync(Guid taskId, RawMovieInfo[] infos)
    {
        throw new NotImplementedException();
    }
}