using MiniClique_Model;
using MiniClique_Model.Request;
using MiniClique_Model.Response;
using MiniClique_Service.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Service.Interface
{
    public interface IUserService
    {
        Task<IEnumerable<GetUserResponse>> GetAllUserAsync();
        Task<Result<User>> CreateAsync(CreateUserRequest user);
        Task<Result<GetUserResponse>> GetUserById(string id);
        ////Task<Result<User>> UpdateUser(string id, UserUpdateRequest userUpdateRequest);
        ////Task<Result<User>> ActiveDeactiveUser(UserStatusRequest userStatusRequest);
        //Task<IEnumerable<object>> GetUserPostById(string id);
        //Task<IEnumerable<object>> GetRandomUser(string currentUserId);
        //Task<Result<User>> GetUserLogin();
        //Task<IEnumerable<object>> GetUserPostLogin();
        //Task<IEnumerable<object>> SearchUser(string keyword, string currentUserId);
        //Task<Result<User>> DeleteUser(string id);

    }
}
