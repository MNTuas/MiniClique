using Microsoft.Extensions.Options;
using MiniClique_Model;
using MiniClique_Repository.Helper;
using MiniClique_Repository.Interface;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Repository
{
    public class UserLikesRepository : IUserLikesRepository
    {
        private readonly IMongoCollection<UserLikes> _userLikesCollection;
        private readonly IOptions<DatabaseSettings> _dbSettings;

        public UserLikesRepository(IOptions<DatabaseSettings> dbSettings)
        {
            _dbSettings = dbSettings;
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _userLikesCollection = mongoDatabase.GetCollection<UserLikes>
                (dbSettings.Value.UserLikesCollectionName);
        }

        public async Task CreateAsync(UserLikes UserLikes) =>
            await _userLikesCollection.InsertOneAsync(UserLikes);

        public async Task<IEnumerable<UserLikes>> GetAllUserLikesAsync()
        {
            var Users = _userLikesCollection.Find(_ => true).ToListAsync();
            return await Users;
           
        }

        public async Task<List<UserLikes>> GetBothUserLikesByEmail(string fromEmail, string toEmail)
        {
            var a = fromEmail.Trim().ToLowerInvariant();
            var b = toEmail.Trim().ToLowerInvariant();

            var pipeline = new[]
            {
        new BsonDocument("$match",
            new BsonDocument("$or", new BsonArray
            {
                new BsonDocument { { "FromEmail", a }, { "ToEmail", b } },
                new BsonDocument { { "FromEmail", b }, { "ToEmail", a } }
            })
        ),
        new BsonDocument("$group",
            new BsonDocument
            {
                { "_id", BsonNull.Value },
                { "likes", new BsonDocument("$push", "$$ROOT") },
                { "count", new BsonDocument("$sum", 1) }
            }
        ),
        new BsonDocument("$match",
            new BsonDocument("count", 2)
        )
    };

            var result = await _userLikesCollection
                .Aggregate<BsonDocument>(pipeline)
                .FirstOrDefaultAsync();

            if (result == null)
                return null;

            return result["likes"]
                .AsBsonArray
                .Select(x => BsonSerializer.Deserialize<UserLikes>(x.AsBsonDocument))
                .ToList();
        }


        public async Task<IEnumerable<UserLikes>> GetUserLikesByEmail(string email)
        {
            var pipeline = new BsonDocument[]
            {
                 new BsonDocument("$match", new BsonDocument("FromEmail", email)),

            };
            var results = await _userLikesCollection.Aggregate<UserLikes>(pipeline).ToListAsync();
            return results;
        }

        public async Task<UserLikes> GetUserLikesById(string id)=>
         await _userLikesCollection.Find(a => a.Id == id).FirstOrDefaultAsync();
    }
}
