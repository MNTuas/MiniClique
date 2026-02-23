using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MiniClique_Model.Request
{
    public class CreateUserRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required, Compare("Password")]
        public string ConfirmPassword { get; set; } = string.Empty;
        [Required]
        [RegularExpression(@"^[\p{L}\s]+$", ErrorMessage = "Full name can only contain letters and spacssses.")]
        public string? FullName { get; set; }
        public bool Gender { get; set; }
        public string? Birthday { get; set; }
        public string? Bio { get; set; }
        public string? Picture { get; set; }
    }
}
