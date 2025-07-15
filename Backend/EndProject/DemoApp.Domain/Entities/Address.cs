using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class Address
    {
        public int AddressId { get; set; }
        
        public int UserId { get; set; }
        
        [Required]
        [StringLength(20)]
        public string AddressType { get; set; } = "Shipping"; // 'Shipping', 'Billing'
        
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [Required]
        [StringLength(200)]
        public string AddressLine1 { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? AddressLine2 { get; set; }
        
        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string State { get; set; } = string.Empty;
        
        [Required]
        [StringLength(20)]
        public string PostalCode { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Country { get; set; } = "Vietnam";
        
        public bool IsDefault { get; set; } = false;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual ICollection<Order> ShippingOrders { get; set; } = new List<Order>();
        public virtual ICollection<Order> BillingOrders { get; set; } = new List<Order>();

        // Helper methods
        public string FullAddress => $"{AddressLine1}, {City}, {State} {PostalCode}, {Country}";
        
        public bool IsShippingAddress => AddressType == "Shipping";
        public bool IsBillingAddress => AddressType == "Billing";
    }
} 