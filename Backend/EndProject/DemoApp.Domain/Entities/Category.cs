using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class Category
    {
        public int CategoryId { get; set; }
        
        [Required]
        [StringLength(100)]
        public string CategoryName { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string? Description { get; set; }
        
        public int? ParentCategoryId { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        public int DisplayOrder { get; set; } = 0;
        
        [StringLength(255)]
        public string? ImageUrl { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual Category? ParentCategory { get; set; }
        public virtual ICollection<Category> SubCategories { get; set; } = new List<Category>();
        public virtual ICollection<Product> Products { get; set; } = new List<Product>();

        // Helper methods
        public bool IsRootCategory => ParentCategoryId == null;
        
        public bool HasSubCategories => SubCategories.Any();
        
        public string FullCategoryPath
        {
            get
            {
                var path = new List<string> { CategoryName };
                var current = ParentCategory;
                
                while (current != null)
                {
                    path.Insert(0, current.CategoryName);
                    current = current.ParentCategory;
                }
                
                return string.Join(" > ", path);
            }
        }
    }
} 