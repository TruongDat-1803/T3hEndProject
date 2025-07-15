using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class Coupon
    {
        public int CouponId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string CouponCode { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string? Description { get; set; }
        
        [Required]
        [StringLength(20)]
        public string DiscountType { get; set; } = string.Empty; // 'Percentage', 'FixedAmount'
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal DiscountValue { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal MinimumOrderAmount { get; set; } = 0;
        
        [Range(0, double.MaxValue)]
        public decimal? MaximumDiscountAmount { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        public int? UsageLimit { get; set; }
        
        public int UsedCount { get; set; } = 0;
        
        public bool IsActive { get; set; } = true;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual ICollection<OrderCoupon> OrderCoupons { get; set; } = new List<OrderCoupon>();

        // Helper methods
        public bool IsPercentageDiscount => DiscountType == "Percentage";
        public bool IsFixedAmountDiscount => DiscountType == "FixedAmount";
        
        public bool IsValid => IsActive && 
                              DateTime.UtcNow >= StartDate && 
                              DateTime.UtcNow <= EndDate &&
                              (UsageLimit == null || UsedCount < UsageLimit);
        
        public bool IsExpired => DateTime.UtcNow > EndDate;
        
        public bool HasUsageLimit => UsageLimit.HasValue;
        
        public int RemainingUsage => UsageLimit.HasValue ? UsageLimit.Value - UsedCount : int.MaxValue;
        
        public decimal CalculateDiscount(decimal orderAmount)
        {
            if (!IsValid || orderAmount < MinimumOrderAmount)
                return 0;
            
            decimal discount = IsPercentageDiscount 
                ? orderAmount * (DiscountValue / 100)
                : DiscountValue;
            
            if (MaximumDiscountAmount.HasValue && discount > MaximumDiscountAmount.Value)
                discount = MaximumDiscountAmount.Value;
            
            return discount;
        }
        
        public bool CanBeAppliedToOrder(decimal orderAmount)
        {
            return IsValid && orderAmount >= MinimumOrderAmount;
        }
    }

    public class OrderCoupon
    {
        public int OrderId { get; set; }
        public int CouponId { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal DiscountAmount { get; set; }

        // Navigation properties
        public virtual Order Order { get; set; } = null!;
        public virtual Coupon Coupon { get; set; } = null!;
    }
} 