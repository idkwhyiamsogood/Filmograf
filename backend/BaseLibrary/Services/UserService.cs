using AutoMapper;
using Filmograf.BaseLibrary.Caching;
using Filmograf.BaseLibrary.DataAccess.Providers;
using Filmograf.BaseLibrary.Models.Dto;
using Filmograf.BaseLibrary.Models.Entities;
using Filmograf.BaseLibrary.Models.HttpExceptions;
using Filmograf.BaseLibrary.Models.Types;

namespace Filmograf.BaseLibrary.Services;

public class UserService
{
    private readonly UserProvider _userProvider;
    private readonly UserCaching _userCaching;
    private readonly IMapper _mapper;
    
    public UserService(UserProvider userProvider, UserCaching userCaching, IMapper mapper)
    {
        _userProvider = userProvider;
        _userCaching = userCaching;
        _mapper = mapper;
    }

    public async Task<UserResponseDto> GetUserInfoAsync(Guid userId)
    {
        var user = await GetByIdAsync(userId);
        return _mapper.Map<UserResponseDto>(user);
    }

    public async Task<User?> GetByGoogleIdAsync(string googleId)
    {
        return await _userProvider.GetByGoogleIdAsync(googleId);
    }
    
    private async Task<User> CreateCacheForUserAsync(Guid userId)
    {
        var user = await _userProvider.GetAsync(userId);
        if (user == null) throw new NotFoundHttpException("UserNotFound", $"Пользователь с id={userId} не найден.");

        return user;
    }

    public async Task<User?> GetByIdAsync(Guid guid)
    {
        var method = async () => await CreateCacheForUserAsync(guid);
        return await _userCaching.CachingAsync(guid, method);
    }

    public async Task<User?> CreateUserAsync(User user)
    {
        return await _userProvider.AddAsync(user);
    }
    
    public async Task<bool> UpdateUserAsync(Guid guid, User user)
    {
        var state = await _userProvider.UpdateAsync(guid, user);
        if (state) await _userCaching.RemoveCachingAsync(guid);

        return state;
    }
}