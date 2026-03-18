using Filmograf.BaseLibrary.Models.Repo;

namespace Filmograf.CommentsService.Util;

public static class CommentEntityTypeUtil
{
    public static string GetCommentEntityTypeKey(this CommentEntityType entityType)
    {
        return entityType switch
        {
            CommentEntityType.Movie => "movie",
            CommentEntityType.Collection => "collection",
            _ => "movie"
        };
    }
}