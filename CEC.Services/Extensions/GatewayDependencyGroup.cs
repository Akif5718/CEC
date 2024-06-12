using System;
using Microsoft.Extensions.DependencyInjection;

namespace CEC.Services.Extensions
{
    public static class GatewayDependencyGroup
    {
        public static IServiceCollection AddGatewayDependencyGroup(this IServiceCollection services)
        {

            // register Managers
            services.AddManagersDependencyGroup();
            return services;
        }
    }
}

