using MiniClique_Model;
using MiniClique_Service.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Service.Interface
{
    public interface IUserMatchesService
    {
        Task<IEnumerable<UserMatches>> GetAllUserMatchesAsync();
        Task<IEnumerable<UserMatches>> GetUserMatchesByEmail(string email);
    }
}
