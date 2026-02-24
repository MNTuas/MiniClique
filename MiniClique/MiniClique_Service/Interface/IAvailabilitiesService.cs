using MiniClique_Model;
using MiniClique_Service.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Service.Interface
{
    public interface IAvailabilitiesService
    {
        Task<IEnumerable<Availabilities>> GetAllAvailabilitiesAsync();
        Task<Result<Availabilities>> CreateAsync(Availabilities Availabilities);
        Task<Result<Availabilities>> GetAvailabilitiesById(string id);
        //Task<IEnumerable<Availabilities>> GetAvailabilitiesByEmail(string email);
        Task<Result<Availabilities>> UpdateAsync(string id, Availabilities request);
    }
}
