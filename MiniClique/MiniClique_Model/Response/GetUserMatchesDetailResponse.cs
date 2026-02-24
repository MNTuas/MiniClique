using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Model.Response
{
    public class GetUserMatchesDetailResponse
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string? UserAEmail { get; set; }
        public string? UserBEmail { get; set; }
        public DateTime? Create_At { get; set; }
        public List<Availabilities> Availabilities { get; set; }
        public List<MatchesSchedule> MatchesSchedule { get; set; }
    }
}
