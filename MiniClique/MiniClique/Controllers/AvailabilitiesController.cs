using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniClique_Model;
using MiniClique_Service;
using MiniClique_Service.Interface;

namespace MiniClique.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvailabilitiesController : ControllerBase
    {
        private readonly IAvailabilitiesService _AvailabilitiesService;

        public AvailabilitiesController(IAvailabilitiesService AvailabilitiesService)
        {
            _AvailabilitiesService = AvailabilitiesService;
        }

        [HttpGet("Get_User_Availabilities")]
        public async Task<IActionResult> GetAllAvailabilities()
        {
            var users = await _AvailabilitiesService.GetAllAvailabilitiesAsync();
            return Ok(users);
        }

        [HttpGet("Get_User_Availabilities_By_Id")]
        public async Task<IActionResult> GetAllUserAvailabilityById(string id)
        {
            var avail = await _AvailabilitiesService.GetAvailabilitiesById(id);
            if (avail == null)
            {
                return BadRequest(avail);
            }
            return Ok(avail);
        }

        [HttpPost("Create_User_Availabilities")]
        public async Task<IActionResult> CreateAvailabilities(Availabilities Availabilities)
        {
            var users = await _AvailabilitiesService.CreateAsync(Availabilities);
            if (users.Success)
            {
                return Ok(users);
            }
            else
            {
                return BadRequest(users);
            }
        }

        [HttpPut("Update_User_Availabilities/{id}")]
        public async Task<IActionResult> UpdateAvailabilities(string id, Availabilities Availabilities)
        {
            var users = await _AvailabilitiesService.UpdateAsync(id,Availabilities);
            if (users.Success)
            {
                return Ok(users);
            }
            else
            {
                return BadRequest(users);
            }
        }
    }
}
