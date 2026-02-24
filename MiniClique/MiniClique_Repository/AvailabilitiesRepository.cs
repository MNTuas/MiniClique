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
    public class AvailabilitiesRepository : IAvailabilitiesRepository
    {
        private readonly IMongoCollection<Availabilities> _AvailabilitiesCollection;
        private readonly IOptions<DatabaseSettings> _dbSettings;

        public AvailabilitiesRepository(IOptions<DatabaseSettings> dbSettings)
        {
            _dbSettings = dbSettings;
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _AvailabilitiesCollection = mongoDatabase.GetCollection<Availabilities>
                (dbSettings.Value.AvailabilitiesCollectionName);
        }

        public async Task CreateAsync(Availabilities Availabilities) =>
            await _AvailabilitiesCollection.InsertOneAsync(Availabilities);

        public async Task<IEnumerable<Availabilities>> GetAllAvailabilitiesAsync()
        {
            var Users = _AvailabilitiesCollection.Find(_ => true).ToListAsync();
            return await Users;
        }

        public async Task<Availabilities> GetAvailabilitiesById(string id) =>
         await _AvailabilitiesCollection.Find(a => a.Id == id).FirstOrDefaultAsync();

        public async Task<List<Availabilities>?> GetMatchIfTwoUsers(string matchId)
        {
            var users = await _AvailabilitiesCollection
                .Find(x => x.MatchId == matchId)
                .ToListAsync();

            if (users.Count == 2)
                return users;

            return null;
        }

        public async Task UpdateAvailabilities(string id, Availabilities availabilities) =>
            await _AvailabilitiesCollection.FindOneAndReplaceAsync(a => a.Id == availabilities.Id, availabilities);
    }
}

