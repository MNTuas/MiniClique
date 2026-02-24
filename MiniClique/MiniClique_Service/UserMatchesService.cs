using MiniClique_Model;
using MiniClique_Model.Response;
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

        public async Task<IEnumerable<GetUserMatchesDetailResponse>> GetUserMatchesDetailByEmailAndId(string id, string email)
        {
            var user = await _userRepository.GetUserByEmail(email);
            if (user == null)
            {
                return null;
            }

            var userMatches = await _userMatchesRepository.GetUserMatchesDetailByEmailAndId( id, email);

            var responses = userMatches.Select(u => new GetUserMatchesDetailResponse
            {
                Id = u.Id,
                UserAEmail = u.UserAEmail,
                UserBEmail = u.UserBEmail,
                Create_At = u.Create_At,

                Availabilities = u.Availabilities?.Select(a => new Availabilities
                {
                    Id = a.Id,
                    MatchId = a.MatchId,
                    UserEmail = a.UserEmail,
                    AvailableTimes = a.AvailableTimes?.Select(s => new Slots
                    {
                        StartTime = s.StartTime,
                        Date = s.Date,
                    }).ToList(),
                    Create_At = a.Create_At
                }).ToList(),

                MatchesSchedule = u.MatchesSchedule?.Select(b => new MatchesSchedule
                {
                    Id = b.Id,
                    MatchId = b.MatchId,
                    UserAEmail = b.UserAEmail,
                    UserBEmail = b.UserBEmail,
                    MatchesTime = b.MatchesTime?.Select(s => new Slots
                    {
                        StartTime = s.StartTime,
                        Date = s.Date,
                    }).ToList(),
                    Status = b.Status,
                    Create_At = b.Create_At,
                    Update_At = b.Update_At
                }).ToList()
            }).ToList();

            return responses;
        }

        public async Task<IEnumerable<GetUserMatchesDetailResponse>> GetUserMatchesDetailById(string id)
        {

            var userMatches = await _userMatchesRepository.GetUserMatchesDetailById(id);

            var responses = userMatches.Select(u => new GetUserMatchesDetailResponse
            {
                Id = u.Id,
                UserAEmail = u.UserAEmail,
                UserBEmail = u.UserBEmail,
                Create_At = u.Create_At,

                Availabilities = u.Availabilities?.Select(a => new Availabilities
                {
                    Id = a.Id,
                    MatchId = a.MatchId,
                    UserEmail = a.UserEmail,
                    AvailableTimes = a.AvailableTimes?.Select(s => new Slots
                    {
                        StartTime = s.StartTime,
                        Date = s.Date,
                    }).ToList(),
                    Create_At = a.Create_At
                }).ToList(),

                MatchesSchedule = u.MatchesSchedule?.Select(b => new MatchesSchedule
                {
                    Id = b.Id,
                    MatchId = b.MatchId,
                    UserAEmail = b.UserAEmail,
                    UserBEmail = b.UserBEmail,
                    MatchesTime = b.MatchesTime?.Select(s => new Slots
                    {
                        StartTime = s.StartTime,
                        Date = s.Date,
                    }).ToList(),
                    Status = b.Status,
                    Create_At = b.Create_At,
                    Update_At = b.Update_At
                }).ToList()
            }).ToList();

            return responses;
        }
    }
}
