using System.Data;

namespace CEC.Repositories.Connections.Interface
{
    public interface IDbConnectionFactory
    {
        IDbConnection CreateDbConnection(ConnectionName connectionName);
    }
}

