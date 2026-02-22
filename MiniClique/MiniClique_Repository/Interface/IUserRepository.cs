using MiniClique_Model;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Repository.Interface
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUserAsync();
        Task<User> GetUserById(string id);
        Task<User> GetUserByEmail(string email);
        Task CreateAsync(User User);
        Task UpdateUser(string id, User User);
        Task<UpdateResult> UpdateUserStatus(FilterDefinition<User> filter, UpdateDefinition<User> update);
        Task DeleteUser(string id);   
        Task<IEnumerable<User>> GetRandomUser();
        Task<User> GetUserByIdToUpdate(string id);
        Task<IEnumerable<User>> SearchUser(string keyword);
    }
}
