using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.BaseLibrary.Models.Dto;

public class PaginationQueryDto
{
    [DefaultValue(0)]
    public int Page { get; set; }
    
    [DefaultValue(50)]
    public int Count { get; set; }
    
    [DefaultValue("asc")]
    [RegularExpression("^(asc|desc)$", ErrorMessage = "SortDirection must be either 'asc' or 'desc'")]
    public string? SortDirection { get; set; }

    public override string ToString()
    {
        var keyStr = $"{Page}-{Count}-{SortDirection}";
        return HashUtil.HashSHA256(keyStr);
    }
}