namespace DemoApp.Domain.Enums
{
    public enum PaymentStatus
    {
        Pending = 1,
        Paid = 2,
        Failed = 3,
        Refunded = 4
    }

    public static class PaymentStatusExtensions
    {
        public static string GetDisplayName(this PaymentStatus status)
        {
            return status switch
            {
                PaymentStatus.Pending => "Chờ thanh toán",
                PaymentStatus.Paid => "Đã thanh toán",
                PaymentStatus.Failed => "Thanh toán thất bại",
                PaymentStatus.Refunded => "Đã hoàn tiền",
                _ => status.ToString()
            };
        }

        public static string GetStatusClass(this PaymentStatus status)
        {
            return status switch
            {
                PaymentStatus.Pending => "warning",
                PaymentStatus.Paid => "success",
                PaymentStatus.Failed => "danger",
                PaymentStatus.Refunded => "info",
                _ => "secondary"
            };
        }
    }
} 