using MiniClique_Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Repository.Interface
{
    public interface IMatchesScheduleRepository
    {
        Task<IEnumerable<MatchesSchedule>> GetAllMatchesScheduleAsync();
        Task<MatchesSchedule> GetMatchesScheduleById(string id);
        Task<MatchesSchedule> GetByMatchId(string id);
        Task CreateAsync(MatchesSchedule MatchesSchedule);
    }
}
