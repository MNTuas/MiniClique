using MiniClique_Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Repository.Interface
{
    public interface IAvailabilitiesRepository
    {
        Task<IEnumerable<Availabilities>> GetAllAvailabilitiesAsync();
        Task<Availabilities> GetAvailabilitiesById(string id);
        //Task<IEnumerable<Availabilities>> GetAvailabilitiesByEmail(string email);
        //Task<List<Availabilities>> GetBothAvailabilitiesByEmail(string fromEmail, string toEmail);
        Task CreateAsync(Availabilities Availabilities);
        Task<List<Availabilities>?> GetMatchIfTwoUsers(string matchId);
        Task UpdateAvailabilities(string id, Availabilities availabilities);
    }
}
