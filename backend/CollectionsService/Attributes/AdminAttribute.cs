using Filmograf.BaseLibrary.Models.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Filmograf.CollectionsService.Attributes;

public class AdminAttribute : AuthorizeAttribute, IAuthorizationFilter
{
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

        if (!authContext.CurrentUser.IsAdmin)
        {
            context.Result = new ForbidResult();
        }
    }
}