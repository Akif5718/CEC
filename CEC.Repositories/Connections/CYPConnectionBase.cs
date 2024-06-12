using System;
using CEC.Repositories.Connections.Interface;
using System.Data;

namespace CEC.Repositories.Connections
{
    public abstract class BHConnectionBase
    {
        public IDbConnection Connection { get; private set; }

        public BHConnectionBase(IDbConnectionFactory dbConnectionFactory)
        {
            Connection = dbConnectionFactory.CreateDbConnection(ConnectionName.BHDB);
        }
    }
}

