using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MiniClique_Model
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string? FullName { get; set; }
        public bool Gender { get; set; }
        public string? Birthday { get; set; }
        public string? Address { get; set; }
        public string? Picture { get; set; }
        public string? Status { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string? RoleId { get; set; }
        public string Email { get; set; } = string.Empty;
        public DateTime? Create_At { get; set; }

    }
}
