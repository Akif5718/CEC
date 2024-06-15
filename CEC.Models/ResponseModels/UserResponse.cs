using CEC.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CEC.Models.ResponseModels
{
    public class UserResponse : UserModel
    {
        public double X { get; set; }
        public double Y { get; set; }
    }
}
