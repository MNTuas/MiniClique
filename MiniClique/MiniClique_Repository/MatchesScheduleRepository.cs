using Microsoft.Extensions.Options;
using MiniClique_Model;
using MiniClique_Repository.Helper;
using MiniClique_Repository.Interface;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Repository
{
    public class MatchesScheduleRepository : IMatchesScheduleRepository
    {
        private readonly IMongoCollection<MatchesSchedule> _MatchesScheduleCollection;
        private readonly IOptions<DatabaseSettings> _dbSettings;

        public MatchesScheduleRepository(IOptions<DatabaseSettings> dbSettings)
        {
            _dbSettings = dbSettings;
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _MatchesScheduleCollection = mongoDatabase.GetCollection<MatchesSchedule>
                (dbSettings.Value.MatchesScheduleCollectionName);
        }

        public async Task CreateAsync(MatchesSchedule MatchesSchedule) =>
            await _MatchesScheduleCollection.InsertOneAsync(MatchesSchedule);

        public async Task<IEnumerable<MatchesSchedule>> GetAllMatchesScheduleAsync()
        {
            var Users = _MatchesScheduleCollection.Find(_ => true).ToListAsync();
            return await Users;
        }

        public Task<MatchesSchedule> GetByMatchId(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<MatchesSchedule> GetMatchesScheduleById(string matchId) =>
         await _MatchesScheduleCollection.Find(a => a.Id == matchId).FirstOrDefaultAsync();

    }
}
