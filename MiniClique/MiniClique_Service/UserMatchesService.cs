using MiniClique_Model;
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
    public class UserMatchesService : IUserMatchesService
    {
        
        private readonly IUserMatchesRepository _userMatchesRepository;
        private readonly IUserRepository _userRepository;

        public UserMatchesService(IUserMatchesRepository UserMatchesRepository, IUserMatchesRepository userMatchesRepository,
                                IUserRepository userRepository)
        {     
            _userMatchesRepository = userMatchesRepository;
            _userRepository = userRepository;
        }
        

        public Task<IEnumerable<UserMatches>> GetAllUserMatchesAsync()
        {
            var UserMatches = _userMatchesRepository.GetAllUserMatchesAsync();
            return UserMatches;
        }

        public async Task<IEnumerable<UserMatches>> GetUserMatchesByEmail(string email)
        {
            var user = await _userRepository.GetUserByEmail(email);
            if (user == null)
            {
                return null;
            }
            var UserMatches = await _userMatchesRepository.GetUserMatchesByEmail(email);
            return UserMatches;
        }

    }
}
