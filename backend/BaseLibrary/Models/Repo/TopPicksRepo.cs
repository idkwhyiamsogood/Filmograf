using System.ComponentModel.DataAnnotations;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.Options;

namespace Filmograf.BaseLibrary.Models.Repo;

public class TopPicksRepo : RepoBase
{
    [Required]
    [RegularExpression("^(Top_IMDb|Top_Film)$")]
    public string ChartType { get; set; }
    
    [Required]
    [BsonDictionaryOptions(DictionaryRepresentation.ArrayOfDocuments)]
    public Dictionary<Int32, string> Chart { get; set; }
}