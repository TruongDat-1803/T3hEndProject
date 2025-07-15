using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class ProductReview
    {
        public int ReviewId { get; set; }
        
        public int ProductId { get; set; }
        
        public int UserId { get; set; }
        
        public int OrderId { get; set; }
        
        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }
        
        [StringLength(200)]
        public string? Title { get; set; }
        
        [StringLength(1000)]
        public string? Comment { get; set; }
        
        public bool IsVerified { get; set; } = false;
        
        public bool IsApproved { get; set; } = false;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Product Product { get; set; } = null!;
        public virtual User User { get; set; } = null!;
        public virtual Order Order { get; set; } = null!;

        // Helper methods
        public bool IsVerifiedPurchase => IsVerified;
        
        public string UserDisplayName => User.FullName;
        
        public bool CanBeEdited => !IsApproved;
        
        public string RatingStars => new string('★', Rating) + new string('☆', 5 - Rating);
    }
} 