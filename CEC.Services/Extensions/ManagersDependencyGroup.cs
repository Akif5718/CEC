using System;
using CEC.Repositories;
using CEC.Repositories.Connections;
using CEC.Repositories.Connections.Interface;
using CEC.Repositories.Interface;
using CEC.Services.Interface;
using Microsoft.Extensions.DependencyInjection;

namespace CEC.Services.Extensions
{
	public static class ManagersDependencyGroup
	{
        public static IServiceCollection AddManagersDependencyGroup(this IServiceCollection services)
		{
            // Connection
            services.AddTransient<IDbConnectionFactory, DapperConnectionFactory>();

            //Services
            services.AddTransient<IAccountService, AccountService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<ISearchService, SearchService>();

            //Repositories
            services.AddTransient<IAccountRepo, AccountRepo>();
            services.AddTransient<IUserRepo, UserRepo>();
            services.AddTransient<ISearchRepo, SearchRepo>();

            return services;
        }
	}
}

