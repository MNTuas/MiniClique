//using MiniClique_Model;
//using MiniClique_Repository.Interface;
//using MiniClique_Service.Interface;
//using MiniClique_Service.Shared;
//using MongoDB.Driver;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace MiniClique_Service
//{
//    public class UserService : IUserService
//    {
//        private readonly IUserRepository _userRepository;

//        public UserService(IUserRepository userRepository)
//        {
//            _userRepository = userRepository;
//        }

//        public async Task<UserGetAllCount> GetAllUserAsync()
//        {
//            var listUser = await _userRepository.GetAllUserAsync();

//            var newUser = new UserGetAllCount
//            {
//                TotalUser = listUser.Count(),
//                Users = listUser

//            };

//            return newUser;

//        }

//        public class UserGetAllCount
//        {
//            public IEnumerable<UserGetAllResponse> Users { get; set; }
//            public int TotalUser { get; set; }
//        }

//        public async Task<Result<UserGetByIdResponse>> GetUserById(string id)
//        {
//            try
//            {
//                if (!string.IsNullOrEmpty(id))
//                {
//                    var userId = await _userRepository.GetUserById(id);
//                    return new Result<UserGetByIdResponse>
//                    {
//                        Success = true,
//                        Data = userId,
//                    };
//                }
//                return new Result<UserGetByIdResponse>
//                {
//                    Success = false,
//                    ErrorMessage = "Id is not be null",
//                };
//            }
//            catch (Exception ex)
//            {
//                return new Result<UserGetByIdResponse>
//                {
//                    Success = false,
//                    ErrorMessage = ex.Message,
//                };
//            }
//        }

//        public async Task<Result<User>> UpdateUser(string id, UserUpdateRequest userUpdateRequest)
//        {
//            try
//            {
//                var userId = _httpContextAccessor.HttpContext?.User.FindFirst(MySetting.CLAIM_USERID);
//                var existingUser = await _userRepository.GetUserByIdToUpdate(id);
//                if (existingUser == null)
//                {
//                    return new Result<User>
//                    {
//                        Success = false,
//                        ErrorMessage = "User not exists"
//                    };
//                }
//                if (existingUser.Id == userId.Value)
//                {
//                    _mapper.Map(userUpdateRequest, existingUser);
//                    await _userRepository.UpdateUser(id, existingUser);
//                    return new Result<User>
//                    {
//                        Success = true,
//                        ErrorMessage = "Update Successfull",
//                        Data = existingUser
//                    };
//                }
//                return new Result<User>
//                {
//                    Success = false,
//                    ErrorMessage = "You can not access this function",
//                };
//            }
//            catch (Exception ex)
//            {
//                return new Result<User>
//                {
//                    Success = false,
//                    ErrorMessage = ex.Message
//                };
//            }

//        }

//        public async Task<IEnumerable<object>> GetUserPostById(string id)
//        {
//            try
//            {
//                var userPosts = await _userRepository.GetUserPostById(id);

//                if (userPosts == null)
//                {
//                    return Enumerable.Empty<object>();
//                }

//                // Trả về một danh sách các Anonymous Type với các trường cần thiết
//                var newUserPosts = userPosts.Select(post => new
//                {
//                    Post_Id = post.Id,
//                    UserPost = post.userPost
//                });

//                return newUserPosts;
//            }
//            catch (Exception ex)
//            {
//                throw new Exception("Something went wrong: " + ex.Message);
//            }
//        }

//        //lấy suggest user (proccessing)
//        public async Task<IEnumerable<object>> GetRandomUser(string currentUserId)
//        {
//            var users = await _userRepository.GetRandomUser();
//            var newUsers = new List<object>();

//            foreach (var user in users)
//            {
//                bool isFollowing = await _userFollowRepository.IsFollowingAsync(currentUserId, user.Id);
//                newUsers.Add(new
//                {
//                    User_Id = user.Id,
//                    FullName = user.FullName,
//                    Picture = user.Picture,
//                    IsFollowing = isFollowing
//                });
//            }

//            return newUsers;
//        }

//        //lấy thông tin user đang login
//        public async Task<Result<UserGetByIdResponse>> GetUserLogin()
//        {
//            try
//            {

//                var idClaim = _httpContextAccessor.HttpContext.User.FindFirst(MySetting.CLAIM_USERID);

//                if (idClaim == null)
//                {
//                    return new Result<UserGetByIdResponse>
//                    {
//                        Success = false,
//                        ErrorMessage = "User claims are missing"
//                    };
//                }

//                var claimid = idClaim.Value;

//                var user = await _userRepository.GetUserByLogin(claimid);
//                if (user == null)
//                {
//                    return new Result<UserGetByIdResponse>
//                    {
//                        Success = false,
//                        ErrorMessage = "User not found"
//                    };
//                }

//                return new Result<UserGetByIdResponse>
//                {
//                    Success = true,
//                    Data = user,

//                };
//            }
//            catch (Exception ex)
//            {
//                return new Result<UserGetByIdResponse>
//                {
//                    Success = false,
//                    ErrorMessage = "Something wrong!!!"
//                };
//            }
//        }

//        public async Task<IEnumerable<object>> GetUserPostLogin()
//        {
//            var idClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(MySetting.CLAIM_USERID);

//            if (idClaim == null)
//            {
//                throw new Exception("User ID claim not found.");
//            }

//            try
//            {
//                var userId = idClaim.Value;
//                var userPosts = await _userRepository.GetUserPostByLogin(userId);

//                if (userPosts == null)
//                {
//                    return Enumerable.Empty<object>();
//                }

//                // Trả về một danh sách các Anonymous Type với các trường cần thiết
//                var newUserPosts = userPosts.Select(post => new
//                {
//                    Post_Id = post.Id,
//                    UserPost = post.userPost
//                });

//                return newUserPosts;
//            }
//            catch (Exception ex)
//            {
//                throw new Exception("Something went wrong: " + ex.Message);
//            }
//        }

//        public async Task<IEnumerable<object>> SearchUser(string keyword, string currentUserId)
//        {
//            var users = await _userRepository.SearchUser(keyword);
//            if (users == null)
//            {
//                return Enumerable.Empty<object>();
//            }

//            var resultList = new List<object>();
//            foreach (var user in users)
//            {
//                bool isFollowing = await _userFollowRepository.IsFollowingAsync(currentUserId, user.Id);
//                resultList.Add(new
//                {
//                    id = user.Id,
//                    fullName = user.FullName,
//                    picture = user.Picture,
//                    gender = user.Gender,
//                    create_At = user.Create_At,
//                    roleId = user.RoleId,
//                    birthday = user.Birthday,
//                    IsFollowing = isFollowing
//                });
//            }

//            return resultList;
//        }

//        public async Task<Result<User>> DeleteUser(string id)
//        {
//            var user = await _userRepository.GetUserById(id);
//            if (user == null)
//            {
//                return new Result<User>()
//                {
//                    Success = false,
//                    ErrorMessage = "Not found"
//                };
//            }
//            await _userRepository.DeleteUser(id);
//            return new Result<User>()
//            {
//                Success = true,
//                ErrorMessage = "Delete sucessfull"
//            };
//        }

//        Task<User> IUserService.GetAllUserAsync()
//        {
//            throw new NotImplementedException();
//        }

//        Task<Result<User>> IUserService.GetUserById(string id)
//        {
//            throw new NotImplementedException();
//        }

//        Task<Result<User>> IUserService.GetUserLogin()
//        {
//            throw new NotImplementedException();
//        }
//    }
//}
