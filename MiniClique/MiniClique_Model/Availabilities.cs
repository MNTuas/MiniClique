using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Model
{
    public class Availabilities
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        
        [BsonRepresentation(BsonType.ObjectId)]
        public string? MatchId { get; set; }
        public string? UserEmail { get; set; }
        public List<Slots>? AvailableTimes { get; set; }
        public DateTime? Create_At { get; set; }
    }
    public class Slots
    {
        public DateTime Date { get; set; }      
        public TimeSpan StartTime { get; set; }
    }
}
