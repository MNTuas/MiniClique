using MiniClique_Model;
using MiniClique_Model.Response;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Repository.Interface
{
    public interface IUserMatchesRepository
    {
        Task<IEnumerable<UserMatches>> GetAllUserMatchesAsync();
        Task<UserMatches> GetUserMatchesById(string id);
        Task<IEnumerable<UserMatches>> GetUserMatchesByEmail(string email);
        Task<IEnumerable<GetUserMatchesDetailResponse>> GetUserMatchesDetailByEmailAndId(string id, string email);
        Task CreateAsync(UserMatches userMatches);
        Task<IEnumerable<GetUserMatchesDetailResponse>> GetUserMatchesDetailById(string id);
    }
}
