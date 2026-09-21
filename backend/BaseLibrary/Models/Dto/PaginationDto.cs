using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using Filmograf.BaseLibrary.Util;

namespace Filmograf.BaseLibrary.Models.Dto;

public class PaginationQueryDto
{
    [DefaultValue(0)]
    public int Page { get; set; }
    
    [DefaultValue(20)]
    public int Count { get; set; }

    public override string ToString()
    {
        var keyStr = $"{Page}-{Count}";
        return HashUtil.HashSHA256(keyStr);
    }
}