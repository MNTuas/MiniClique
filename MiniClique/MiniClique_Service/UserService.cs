using MiniClique_Model;
using MiniClique_Model.Request;
using MiniClique_Model.Response;
using MiniClique_Repository.Interface;
using MiniClique_Service.Interface;
using MiniClique_Service.Shared;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Service
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<Result<User>> CreateAsync(CreateUserRequest user)
        {
            var exstingUser = await _userRepository.GetUserByEmail(user.Email);

            if (exstingUser != null)
            {
                return new Result<User>
                {
                    Success = false,
                    ErrorMessage = "User already exists"
                };
            }

            var newUser = new User
            {
                Email = user.Email,
                FullName = user.FullName,
                Birthday = user.Birthday ?? "20-01-1989",
                RoleId = "699c5c33b7075728685d6c9d",
                Bio = user.Bio ?? "This is my bio",
                Create_At = DateTime.UtcNow,
                Gender = user.Gender,
                Status = "Active",
                Password = user.Password,
                Picture = user.Picture ?? "https://res.cloudinary.com/depqidlgv/image/upload/v1771854520/455646505_10226057102397556_5136531480083115955_n_w9rwtc.jpg",
            };

            await _userRepository.CreateAsync(newUser);

            return new Result<User>
            {
                Success = true,
                Data = newUser,
                ErrorMessage = "Create user successfull"
                
            };
        }

        public async Task<IEnumerable<GetUserResponse>> GetAllUserAsync()
        {
            var users = await _userRepository.GetAllUserAsync(); 

            if (users == null)
                return Enumerable.Empty<GetUserResponse>();

            var responses = users.Select(u => new GetUserResponse
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Picture = u.Picture,
                Bio = u.Bio,
                Birthday = u.Birthday,
                Create_At = u.Create_At,
                Gender = u.Gender,
                Status = u.Status
            });

            return responses;
        }

        public async Task<Result<GetUserResponse>> GetUserById(string id)
        {
            var user = await _userRepository.GetUserById(id);

            if (user == null)
            {
                return new Result<GetUserResponse>
                {
                    Success = false,
                    Data = null,
                    ErrorMessage = "User not found"
                };
            }

            var response = new GetUserResponse
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Picture = user.Picture,
                Bio = user.Bio, 
                Birthday = user.Birthday,
                Create_At = user.Create_At,
                Gender = user.Gender,
                Status = user.Status
            };

            return new Result<GetUserResponse>
            {
                Success = true,
                Data = response,
                ErrorMessage = null
            };
        }
    }
}
