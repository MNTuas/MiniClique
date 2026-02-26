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
    public class AvailabilitiesService : IAvailabilitiesService
    {
        private readonly IAvailabilitiesRepository _AvailabilitiesRepository;
        private readonly IUserMatchesRepository _userMatchesRepository;
        private readonly IUserRepository _userRepository;
        private readonly IMatchesScheduleRepository _matchesScheduleRepository;

        public AvailabilitiesService(IAvailabilitiesRepository AvailabilitiesRepository, IUserMatchesRepository userMatchesRepository,
                                IUserRepository userRepository, IMatchesScheduleRepository matchesScheduleRepository)
        {
            _AvailabilitiesRepository = AvailabilitiesRepository;
            _userMatchesRepository = userMatchesRepository;
            _userRepository = userRepository;
            _matchesScheduleRepository = matchesScheduleRepository;
        }
        public async Task<Result<Availabilities>> CreateAsync(Availabilities request)
        {
            // Check if the match exists
            var existingMatch = await _userMatchesRepository
                .GetUserMatchesById(request.MatchId);

            if (existingMatch == null)
            {
                return new Result<Availabilities>
                {
                    Success = false,
                    Message = "Match not found"
                };
            }

            // Create new availability
            var newAvailability = new Availabilities
            {
                MatchId = request.MatchId,
                UserEmail = request.UserEmail,
                AvailableTimes = request.AvailableTimes?
                    .Select(x => new Slots
                    {
                        Date = x.Date.Date, 
                        StartTime = x.StartTime
                    }).ToList(),
                Create_At = DateTime.UtcNow
            };

            await _AvailabilitiesRepository.CreateAsync(newAvailability);

            // Find if both users have submitted their availability
            var users = await _AvailabilitiesRepository
                .GetMatchIfTwoUsers(request.MatchId);

            if (users == null)
            {
                return new Result<Availabilities>
                {
                    Success = true,
                    Data = newAvailability,
                    Message = "Availability created. Waiting for second user."
                };
            }

            // Find the first matching slot
            var firstMatchedSlot = users[0].AvailableTimes
                .IntersectBy(
                    users[1].AvailableTimes
                        .Select(x => new { x.Date, x.StartTime }),
                    x => new { x.Date, x.StartTime }
                )
                .OrderBy(x => x.Date)
                .ThenBy(x => x.StartTime)
                .FirstOrDefault();

            if (firstMatchedSlot == null)
            {
                return new Result<Availabilities>
                {
                    Success = true,
                    Data = newAvailability,
                    Message = "Both users submitted but no matching time found."
                };
            }

            // Find if a schedule already exists for this match
            var existingSchedule = await _matchesScheduleRepository
                .GetMatchesScheduleById(request.MatchId);

            if (existingSchedule == null)
            {
                var matchSchedule = new MatchesSchedule
                {
                    MatchId = request.MatchId,
                    UserAEmail = users[0].UserEmail,
                    UserBEmail = users[1].UserEmail,
                    MatchesTime = new List<Slots> { firstMatchedSlot },
                    Status = true,
                    Create_At = DateTime.UtcNow,
                    Update_At = DateTime.UtcNow
                };

                await _matchesScheduleRepository.CreateAsync(matchSchedule);
            }

            return new Result<Availabilities>
            {
                Success = true,
                Data = newAvailability,
                Message = "Match found and schedule created."
            };
        }

        public async Task<Result<Availabilities>> UpdateAsync(string id, Availabilities request)
        {
            // Check if the match exists
            var existingMatch = await _userMatchesRepository
                .GetUserMatchesById(request.MatchId);

            if (existingMatch == null)
            {
                return new Result<Availabilities>
                {
                    Success = false,
                    Message = "Match not found"
                };
            }

            // Find existing availability
            var existingAvailability = await _AvailabilitiesRepository
                .GetAvailabilitiesById(id);

            if (existingAvailability == null)
            {
                return new Result<Availabilities>
                {
                    Success = false,
                    Message = "Availability not found"
                };
            }

            // Update slot
            existingAvailability.MatchId = request.MatchId;
            existingAvailability.UserEmail = request.UserEmail;
            existingAvailability.AvailableTimes = request.AvailableTimes?
                .Select(x => new Slots
                {
                    Date = x.Date.Date,
                    StartTime = x.StartTime
                }).ToList();

            existingAvailability.Create_At = DateTime.UtcNow;

            await _AvailabilitiesRepository.UpdateAvailabilities(existingAvailability.Id, request);

            // Find if both users have submitted their availability
            var users = await _AvailabilitiesRepository
                .GetMatchIfTwoUsers(request.MatchId);

            if (users == null)
            {
                return new Result<Availabilities>
                {
                    Success = true,
                    Data = existingAvailability,
                    Message = "Availability updated. Waiting for second user."
                };
            }

            // Find the first matching slot
            var firstMatchedSlot = users[0].AvailableTimes
                .IntersectBy(
                    users[1].AvailableTimes
                        .Select(x => new { x.Date, x.StartTime }),
                    x => new { x.Date, x.StartTime }
                )
                .OrderBy(x => x.Date)
                .ThenBy(x => x.StartTime)
                .FirstOrDefault();

            if (firstMatchedSlot == null)
            {
                return new Result<Availabilities>
                {
                    Success = true,
                    Data = existingAvailability,
                    Message = "Both users submitted but no matching time found."
                };
            }
            var existingSchedule = await _matchesScheduleRepository
                .GetMatchesScheduleById(request.MatchId);

            if (existingSchedule == null)
            {
                var matchSchedule = new MatchesSchedule
                {
                    MatchId = request.MatchId,
                    UserAEmail = users[0].UserEmail,
                    UserBEmail = users[1].UserEmail,
                    MatchesTime = new List<Slots> { firstMatchedSlot },
                    Status = true,
                    Create_At = DateTime.UtcNow,
                    Update_At = DateTime.UtcNow
                };

                await _matchesScheduleRepository.CreateAsync(matchSchedule);
            }


            return new Result<Availabilities>
            {
                Success = true,
                Data = existingAvailability,
                Message = "Availability updated and schedule recalculated."
            };
        }

        public Task<IEnumerable<Availabilities>> GetAllAvailabilitiesAsync()
        {
            var Availabilities = _AvailabilitiesRepository.GetAllAvailabilitiesAsync();
            return Availabilities;
        }

        public async Task<Result<Availabilities>> GetAvailabilitiesById(string id)
        {
            var Availabilities = await _AvailabilitiesRepository.GetAvailabilitiesById(id);
            if (Availabilities == null)
            {
                return new Result<Availabilities>
                {
                    Success = false,
                    Data = null,
                    Message = "Match not found"
                };
            }
            return new Result<Availabilities>
            {
                Success = true,
                Data = Availabilities,
                Message = "Get availability successful"

            };
        } 
    }
}
