using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class UserRole
    {
        public int RoleId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string RoleName { get; set; } = string.Empty;
        
        [StringLength(255)]
        public string? Description { get; set; }

        // Navigation properties
        public virtual ICollection<UserRoleMapping> UserRoleMappings { get; set; } = new List<UserRoleMapping>();
    }

    public class UserRoleMapping
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual UserRole Role { get; set; } = null!;
    }
} 