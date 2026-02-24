using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniClique_Model;
using MiniClique_Service;
using MiniClique_Service.Interface;

namespace MiniClique.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserLikesController : ControllerBase
    {
        private readonly IUserLikesService _userLikesService;

        public UserLikesController(IUserLikesService userLikesService)
        {
            _userLikesService = userLikesService;
        }

        [HttpGet("Get_User_Likes")]
        public async Task<IActionResult> GetAllUserLikes()
        {
            var users = await _userLikesService.GetAllUserLikesAsync();
            return Ok(users);
        }

        [HttpGet("Get_User_Likes_By_Email")]
        public async Task<IActionResult> GetAllUserLikesByEmail(string email)
        {
            var users = await _userLikesService.GetUserLikesByEmail(email);
            if (users == null)
            {
                return NotFound(new
                {
                    Message = "User not found."
                });
            }
            return Ok(users);
        }

        [HttpPost("Create_User_Likes")]
        public async Task<IActionResult> CreateUserLikes(UserLikes userLikes)
        {
            var users = await _userLikesService.CreateAsync(userLikes);
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
