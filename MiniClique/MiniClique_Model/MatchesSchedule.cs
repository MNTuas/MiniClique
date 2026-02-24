using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Model
{
    public class MatchesSchedule
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string? MatchId { get; set; }
        public string? UserAEmail { get; set; }
        public string? UserBEmail { get; set; }
        public List<Slots>? MatchesTime { get; set; }
        public bool? Status { get; set; }
        public DateTime? Create_At { get; set; }
        public DateTime? Update_At { get; set; }
    }    
}
