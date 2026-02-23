using Microsoft.Extensions.Options;
using MiniClique_Model;
using MiniClique_Model.Request;
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
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<User> _userCollection;
        private readonly IOptions<DatabaseSettings> _dbSettings;
       
        public UserRepository(IOptions<DatabaseSettings> dbSettings)
        {
            _dbSettings = dbSettings;
            var mongoClient = new MongoClient(dbSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
            _userCollection = mongoDatabase.GetCollection<User>
                (dbSettings.Value.UserCollectionName);
        }

        public async Task<IEnumerable<User>> GetAllUserAsync()
        {
            var Users = _userCollection.Find(_ => true).ToListAsync();
            return await Users;

            //var pipeline = new BsonDocument[]
            //{
            //    new BsonDocument("$lookup", new BsonDocument
            //    {
            //        {"from", "RoleCollection" },
            //        {"localField", "RoleId" },
            //        {"foreignField", "_id" },
            //        {"as", "user_role" }
            //    }),
            //    new BsonDocument("$unwind", "$user_role"),
            //    //thông cảm mới học mongodb 
            //    new BsonDocument("$project", new BsonDocument
            //    {
            //        { "_id", 1 },
            //        { "FullName", 1 },
            //        { "Gender", 1 },
            //        { "Birthday", 1 },
            //        { "Address", 1 },
            //        { "Picture", 1 },
            //        { "Description", 1 },
            //        { "CoverPicture", 1 },
            //        { "Status", 1 },
            //        { "Create_At", 1 },
            //        { "VerificationToken", 1 },
            //        { "RoleId", 1 },
            //        { "Email", 1 },
            //        { "VerifiedAt",1 },
            //        { "RoleName", "$user_role.Name" }
            //    })
            //};
            //var results = await _userCollection.Aggregate<User>(pipeline).ToListAsync();
            //return results;
        }

        public async Task<User> GetUserByIdToUpdate(string id) =>
            await _userCollection.Find(a => a.Id == id).FirstOrDefaultAsync();

        public async Task<User> GetUserById(string id) =>
            await _userCollection.Find(a => a.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(User User) =>
            await _userCollection.InsertOneAsync(User);

        public async Task UpdateUser(string id, User User) =>
            await _userCollection.FindOneAndReplaceAsync(a => a.Id == User.Id, User);

        public async Task DeleteUser(string id) =>
            await _userCollection.DeleteOneAsync(a => a.Id == id);

        public async Task<User> GetUserByEmail(string email)
        {
            var pipeline = new BsonDocument[]
            {
                 new BsonDocument("$match", new BsonDocument("Email", email)),

            };
            var results = await _userCollection.Aggregate<User>(pipeline).FirstOrDefaultAsync();
            return results;
        }

        public async Task<UpdateResult> UpdateUserStatus(FilterDefinition<User> filter, UpdateDefinition<User> update)
        {
            return await _userCollection.UpdateOneAsync(filter, update);
        }

        public async Task<IEnumerable<User>> GetRandomUser()
        {
            var pipeline = new BsonDocument[]
           {
                new BsonDocument("$sample",
                new BsonDocument("size", 3)),
                new BsonDocument("$sort",
                new BsonDocument("_id", 1))
           };
            var results = await _userCollection.Aggregate<User>(pipeline).ToListAsync();
            return results;
        }

        public async Task<IEnumerable<User>> SearchUser(string keyword)
        {
            var pipeline = new BsonDocument[]
            {
                new BsonDocument("$match", new BsonDocument("$or",

                new BsonArray
                {
                new BsonDocument("FullName",
                new BsonDocument
                    {
                        { "$regex", keyword },
                        { "$options", "i" }
                    }),
                new BsonDocument("Email",
                new BsonDocument
                    {
                        { "$regex", keyword },
                        { "$options", "i" }
                    }),
            }))

            };
            var results = await _userCollection.Aggregate<User>(pipeline).ToListAsync();
            return results;
        }

    }
}
