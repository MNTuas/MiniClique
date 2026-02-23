using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Repository.Helper
{
    public class DatabaseSettings
    {
        public string? ConnectionString { get; set; }
        public string? DatabaseName { get; set; }
        public string? UserCollectionName { get; set; }
        public string? UserLikesCollectionName { get; set; }
        public string? UserMatchesCollectionName { get; set; }
    }
}
