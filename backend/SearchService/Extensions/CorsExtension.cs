using Filmograf.BaseLibrary.Util;

namespace Filmograf.SearchService.Extensions;

internal static class CorsExtension
{
    public static IServiceCollection AddCorsConfig(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll",
                policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                });

            options.AddPolicy("AllowFrontend",
                policy => 
                {
                    policy.WithOrigins(
                            AppSettingsUtil.AppSettings.OriginSettings.FrontendOrigin.Split(";")
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod().AllowCredentials();
                });
        });

        return services;
    }
}