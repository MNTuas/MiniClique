using MiniClique_Model;
using MiniClique_Model.Request;
using MiniClique_Model.Response;
using MiniClique_Service.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Service.Interface
{
    public interface IUserLikesService
    {
        Task<IEnumerable<UserLikes>> GetAllUserLikesAsync();
        Task<Result<object>> CreateAsync(UserLikes userLikes);
        //Task<Result<UserLikes>> GetUserLikesById(string id);
        Task<Result<UserLikes>> GetUserLikesByEmail(string email);
    }
}
