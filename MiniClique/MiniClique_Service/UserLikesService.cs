using MiniClique_Model;
using MiniClique_Repository;
using MiniClique_Repository.Interface;
using MiniClique_Service.Interface;
using MiniClique_Service.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Service
{
    public class UserLikesService : IUserLikesService
    {
        private readonly IUserLikesRepository _userLikesRepository;
        private readonly IUserMatchesRepository _userMatchesRepository;
        private readonly IUserRepository _userRepository;

        public UserLikesService(IUserLikesRepository userLikesRepository, IUserMatchesRepository userMatchesRepository,
                                IUserRepository userRepository) 
        {
            _userLikesRepository = userLikesRepository;
            _userMatchesRepository = userMatchesRepository;
            _userRepository = userRepository;
        }
        public async Task<Result<object>> CreateAsync(UserLikes userLikes)
        {
            var bothUser = await _userRepository.GetBothUserByEmail(userLikes.FromEmail,userLikes.ToEmail);
            if(bothUser == null)
            {
                return new Result<object>
                {
                    Success = false,
                    Data = null,
                    Message = "user not found"
                };
            }

            var newUserLikes = new UserLikes
            {
                FromEmail = userLikes.FromEmail,
                ToEmail = userLikes.ToEmail,
                Create_At = DateTime.UtcNow
            };

            await _userLikesRepository.CreateAsync(newUserLikes);

            // Check if both users like each other
            var bothLike = await _userLikesRepository.GetBothUserLikesByEmail(
                userLikes.FromEmail,
                userLikes.ToEmail
            );
            
            if (bothLike != null)
            {
                var newUserMatches = new UserMatches
                {
                    UserAEmail = userLikes.FromEmail,
                    UserBEmail = userLikes.ToEmail,
                    Create_At = DateTime.UtcNow
                };

                await _userMatchesRepository.CreateAsync(newUserMatches);

                return new Result<object>
                {
                    Success = true,
                    Data = newUserMatches,
                    Message = "Both are matches successful"
                };
            }

            return new Result<object>
            {
                Success = true,
                Data = newUserLikes,
                Message = "Create user likes successful"
            };
        }

        public Task<IEnumerable<UserLikes>> GetAllUserLikesAsync()
        {
            var userLikes = _userLikesRepository.GetAllUserLikesAsync();
            return userLikes;
        }

        public async Task<Result<UserLikes>> GetUserLikesByEmail(string email)
        {
            var userLikes = await _userLikesRepository.GetUserLikesByEmail(email);
            if (userLikes == null)
            {
                return new Result<UserLikes>
                {
                    Success = false,
                    Data = null,
                    Message = "User likes not found"
                };
            }
            return new Result<UserLikes>
            {
                Success = true,
                Data = userLikes,
                Message = "Get user likes successful"
            };
        }

    }
}
