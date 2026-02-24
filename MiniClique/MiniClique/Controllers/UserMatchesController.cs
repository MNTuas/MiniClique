using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniClique_Model;
using MiniClique_Service.Interface;

namespace MiniClique.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserMatchesController : ControllerBase
    {
        private readonly IUserMatchesService _UserMatchesService;

        public UserMatchesController(IUserMatchesService UserMatchesService)
        {
            _UserMatchesService = UserMatchesService;
        }

        [HttpGet("Get_User_Matches")]
        public async Task<IActionResult> GetAllUserMatches()
        {
            var users = await _UserMatchesService.GetAllUserMatchesAsync();
            return Ok(users);
        }

        [HttpGet("Get_User_Matches_By_Email")]
        public async Task<IActionResult> GetAllUserMatchesByEmail(string email)
        {
            var users = await _UserMatchesService.GetUserMatchesByEmail(email);
            if (users == null)
            {
                return NotFound(new
                {
                    Message = "User matches not found."
                });
            }
            return Ok(users);
        }

        [HttpGet("Get_User_Matches_Detail_By_EmailId")]
        public async Task<IActionResult> GetUserMatchesDetailByEmailAndId(string id, string email)
        {
            var users = await _UserMatchesService.GetUserMatchesDetailByEmailAndId(id, email);
            if (users == null)
            {
                return NotFound(new
                {
                    Message = "User matches not found."
                });
            }
            return Ok(users);
        }

        [HttpGet("Get_User_Matches_Detail_By_Id")]
        public async Task<IActionResult> GetAllUserMatchesDetailById(string id)
        {
            var users = await _UserMatchesService.GetUserMatchesDetailById(id);
            if (users == null)
            {
                return NotFound(new
                {
                    Message = "User matches not found."
                });
            }
            return Ok(users);
        }
    }
}
