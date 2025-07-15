using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class Order
    {
        public int OrderId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string OrderNumber { get; set; } = string.Empty;
        
        public int UserId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string OrderStatus { get; set; } = "Pending"; // 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
        
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        
        public int ShippingAddressId { get; set; }
        
        public int BillingAddressId { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal SubTotal { get; set; }
        
        [Range(0, double.MaxValue)]
        public decimal TaxAmount { get; set; } = 0;
        
        [Range(0, double.MaxValue)]
        public decimal ShippingAmount { get; set; } = 0;
        
        [Range(0, double.MaxValue)]
        public decimal DiscountAmount { get; set; } = 0;
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }
        
        [StringLength(50)]
        public string? PaymentMethod { get; set; } // 'COD', 'CreditCard', 'BankTransfer'
        
        [Required]
        [StringLength(50)]
        public string PaymentStatus { get; set; } = "Pending"; // 'Pending', 'Paid', 'Failed'
        
        [StringLength(500)]
        public string? Notes { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Address ShippingAddress { get; set; } = null!;
        public virtual Address BillingAddress { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<OrderCoupon> OrderCoupons { get; set; } = new List<OrderCoupon>();
        public virtual ICollection<ProductReview> ProductReviews { get; set; } = new List<ProductReview>();

        // Helper methods
        public bool IsPending => OrderStatus == "Pending";
        public bool IsConfirmed => OrderStatus == "Confirmed";
        public bool IsProcessing => OrderStatus == "Processing";
        public bool IsShipped => OrderStatus == "Shipped";
        public bool IsDelivered => OrderStatus == "Delivered";
        public bool IsCancelled => OrderStatus == "Cancelled";
        
        public bool IsPaid => PaymentStatus == "Paid";
        public bool IsPaymentPending => PaymentStatus == "Pending";
        public bool IsPaymentFailed => PaymentStatus == "Failed";
        
        public decimal TotalWithTax => SubTotal + TaxAmount;
        public decimal FinalTotal => TotalWithTax + ShippingAmount - DiscountAmount;
        
        public int TotalItems => OrderItems.Sum(oi => oi.Quantity);
        
        public bool CanBeCancelled => IsPending || IsConfirmed;
        
        public bool CanBeShipped => IsConfirmed || IsProcessing;
        
        public void UpdateStatus(string newStatus)
        {
            OrderStatus = newStatus;
            UpdatedDate = DateTime.UtcNow;
        }
        
        public void UpdatePaymentStatus(string newPaymentStatus)
        {
            PaymentStatus = newPaymentStatus;
            UpdatedDate = DateTime.UtcNow;
        }
        
        public void AddOrderItem(OrderItem item)
        {
            OrderItems.Add(item);
            RecalculateTotals();
        }
        
        public void RecalculateTotals()
        {
            SubTotal = OrderItems.Sum(oi => oi.TotalPrice);
            TotalAmount = FinalTotal;
            UpdatedDate = DateTime.UtcNow;
        }
    }
} 