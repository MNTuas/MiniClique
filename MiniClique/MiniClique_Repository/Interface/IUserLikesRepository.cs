using MiniClique_Model;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Repository.Interface
{
    public interface IUserLikesRepository
    {
        Task<IEnumerable<UserLikes>> GetAllUserLikesAsync();
        Task<UserLikes> GetUserLikesById(string id);
        Task<UserLikes> GetUserLikesByEmail(string email);
        Task<List<UserLikes>> GetBothUserLikesByEmail(string fromEmail, string toEmail);
        Task CreateAsync(UserLikes userLikes);
    }
}
