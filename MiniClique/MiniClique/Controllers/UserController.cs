using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiniClique_Model;
using MiniClique_Model.Request;
using MiniClique_Service.Interface;

namespace MiniClique.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("Get_User")]
        public async Task<IActionResult> GetAllUser()
        {
            var users = await _userService.GetAllUserAsync();
            return Ok(users);
        }

        [HttpGet("Get_User_By_Id")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var users = await _userService.GetUserById(id);
            if (users.Success)
            {
                return Ok(users);
            }
            else
            {
                return BadRequest(users);
            }
        }

        [HttpGet("Get_User_By_Email")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var users = await _userService.GetUserByEmail(email);
            if (users.Success)
            {
                return Ok(users);
            }
            else
            {
                return BadRequest(users);
            }
        }

        [HttpPost("Create_User")]
        public async Task<IActionResult> CreateUser(CreateUserRequest user)
        {
            var users = await _userService.CreateAsync(user);
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
