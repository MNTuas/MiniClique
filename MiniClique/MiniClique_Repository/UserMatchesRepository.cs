using Microsoft.Extensions.Options;
using MiniClique_Model;
using MiniClique_Model.Response;
using MiniClique_Repository.Helper;
using MiniClique_Repository.Interface;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Repository
{
    public class UserMatchesRepository : IUserMatchesRepository
    {
        private readonly IMongoCollection<UserMatches> _UserMatchesCollection;
        private readonly IOptions<DatabaseSettings> _dbSettings;

        public UserMatchesRepository(IOptions<DatabaseSettings> dbSettings)
        {
            _dbSettings = dbSettings;
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _UserMatchesCollection = mongoDatabase.GetCollection<UserMatches>
                (dbSettings.Value.UserMatchesCollectionName);
        }

        public async Task CreateAsync(UserMatches UserMatches) =>
            await _UserMatchesCollection.InsertOneAsync(UserMatches);

        public async Task<IEnumerable<UserMatches>> GetAllUserMatchesAsync()
        {
            var Users = _UserMatchesCollection.Find(_ => true).ToListAsync();
            return await Users;

        }

        public async Task<UserMatches> GetBothUserMatchesByEmail(string fromEmail, string toEmail)
        {
            var a = fromEmail.Trim().ToLowerInvariant();
            var b = toEmail.Trim().ToLowerInvariant();

            var pipeline = new BsonDocument[]
            {
                new BsonDocument("$match", new BsonDocument("$or", new BsonArray
                {
                    new BsonDocument { { "FromEmail", a }, { "ToEmail", b } },
                    new BsonDocument { { "FromEmail", b }, { "ToEmail", a } }
                }))
            };

            var results = await _UserMatchesCollection.Aggregate<UserMatches>(pipeline).FirstOrDefaultAsync();
            return results;
        }

        public async Task<IEnumerable<UserMatches>> GetUserMatchesByEmail(string email)
        {
            var pipeline = new BsonDocument[]
            {
                 new BsonDocument("$match", new BsonDocument("$or", new BsonArray
                {
                    new BsonDocument { { "UserAEmail", email } },
                    new BsonDocument { { "UserBEmail", email } }
                }))

            };
            var results = await _UserMatchesCollection.Aggregate<UserMatches>(pipeline).ToListAsync();
            return results;
        }

        public async Task<IEnumerable<GetUserMatchesDetailResponse>> GetUserMatchesDetailByEmailAndId(string id, string email)
        {
            var normalizedEmail = email.Trim().ToLowerInvariant();

            var pipeline = new[]
            {
                 new BsonDocument("$match",
                    new BsonDocument("$and",
                    new BsonArray
                    {
                        new BsonDocument("$or",
                        new BsonArray
                        {
                            new BsonDocument("UserAEmail", email),
                            new BsonDocument("UserBEmail", email)
                        }),
                    new BsonDocument("_id",
                    new ObjectId(id))
                    })),
    
                new BsonDocument("$lookup",
                new BsonDocument
                {
                    { "from", "AvailabilitiesCollection" },
                    { "let", new BsonDocument("matchId", "$_id") },
                    { "pipeline", new BsonArray
                        {
                            new BsonDocument("$match",
                            new BsonDocument("$expr",
                            new BsonDocument("$and", new BsonArray
                            {
                                new BsonDocument("$eq", new BsonArray { "$MatchId", "$$matchId" }),
                                new BsonDocument("$eq", new BsonArray { "$UserEmail", normalizedEmail })
                            })))   
                        }
                },
                    { "as", "Availabilities" }
                }),

                new BsonDocument("$lookup",
                new BsonDocument
                {
                    { "from", "MatchesScheduleCollection" },
                    { "localField", "_id" },
                    { "foreignField", "MatchId" },
                    { "as", "MatchesSchedule" }
                })
            };

            var results = await _UserMatchesCollection
                .Aggregate<GetUserMatchesDetailResponse>(pipeline)
                .ToListAsync();

            return results;
        }

        public async Task<IEnumerable<GetUserMatchesDetailResponse>> GetUserMatchesDetailById(string id)
        {

            var pipeline = new[]
            {
                new BsonDocument("$match",
                new BsonDocument("_id", id)
            ),

                new BsonDocument("$lookup",
                new BsonDocument
                    {
                        { "from", "AvailabilitiesCollection" },
                        { "localField", "_id" },
                        { "foreignField", "MatchId" },
                        { "as", "Availabilities" }
                    }
            ),

                new BsonDocument("$lookup",
                new BsonDocument
                    {
                        { "from", "MatchesScheduleCollection" },
                        { "localField", "_id" },
                        { "foreignField", "MatchId" },
                        { "as", "MatchesSchedule" }
                    }
            )
        };

            var results = await _UserMatchesCollection
                .Aggregate<GetUserMatchesDetailResponse>(pipeline)
                .ToListAsync();

            return results;
        }

        public async Task<UserMatches> GetUserMatchesById(string id) =>
         await _UserMatchesCollection.Find(a => a.Id == id).FirstOrDefaultAsync();
    }
}
