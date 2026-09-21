using System.ComponentModel;
using Filmograf.BaseLibrary.Models.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Filmograf.CommentsService.Attributes;

public class UserTypePolicyAttribute : AuthorizeAttribute, IAuthorizationFilter
{
    [DefaultValue(true)] 
    public bool Guest { get; set; } = true;
    
    [DefaultValue(true)] 
    public bool Member { get; set; } = true;
    
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (!context.HttpContext.User.Identity.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var authContext = context.HttpContext.RequestServices.GetService<AuthContext>();
            
        if (authContext == null || authContext.CurrentUser == null)
        {
            context.Result = new ForbidResult();
            return;
        }

        if (authContext.CurrentUser.UserType == "Guest" && !Guest)
        {
            context.Result = new ForbidResult();
            return;
        }

        if (authContext.CurrentUser.UserType == "Member" && !Member)
        {
            context.Result = new ForbidResult();
        }
    }
}