using System.ComponentModel.DataAnnotations;

namespace DemoApp.Domain.Entities
{
    public class Notification
    {
        public int NotificationId { get; set; }
        
        public int UserId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        [StringLength(500)]
        public string Message { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string? NotificationType { get; set; } // 'Order', 'Promotion', 'System'
        
        public bool IsRead { get; set; } = false;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; } = null!;

        // Helper methods
        public bool IsOrderNotification => NotificationType == "Order";
        public bool IsPromotionNotification => NotificationType == "Promotion";
        public bool IsSystemNotification => NotificationType == "System";
        
        public void MarkAsRead()
        {
            IsRead = true;
        }
        
        public string TimeAgo
        {
            get
            {
                var timeSpan = DateTime.UtcNow - CreatedDate;
                
                if (timeSpan.TotalDays >= 1)
                    return $"{(int)timeSpan.TotalDays} ngày trước";
                else if (timeSpan.TotalHours >= 1)
                    return $"{(int)timeSpan.TotalHours} giờ trước";
                else if (timeSpan.TotalMinutes >= 1)
                    return $"{(int)timeSpan.TotalMinutes} phút trước";
                else
                    return "Vừa xong";
            }
        }
    }
} 