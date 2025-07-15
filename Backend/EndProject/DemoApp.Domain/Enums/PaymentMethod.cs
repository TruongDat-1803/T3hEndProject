namespace DemoApp.Domain.Enums
{
    public enum PaymentMethod
    {
        COD = 1,           // Cash on Delivery
        CreditCard = 2,     // Credit Card
        BankTransfer = 3,   // Bank Transfer
        DigitalWallet = 4,  // Digital Wallet (Momo, ZaloPay, etc.)
        Installment = 5     // Installment Payment
    }

    public static class PaymentMethodExtensions
    {
        public static string GetDisplayName(this PaymentMethod method)
        {
            return method switch
            {
                PaymentMethod.COD => "Thanh toán khi nhận hàng",
                PaymentMethod.CreditCard => "Thẻ tín dụng",
                PaymentMethod.BankTransfer => "Chuyển khoản ngân hàng",
                PaymentMethod.DigitalWallet => "Ví điện tử",
                PaymentMethod.Installment => "Trả góp",
                _ => method.ToString()
            };
        }

        public static string GetIcon(this PaymentMethod method)
        {
            return method switch
            {
                PaymentMethod.COD => "cash",
                PaymentMethod.CreditCard => "credit-card",
                PaymentMethod.BankTransfer => "bank",
                PaymentMethod.DigitalWallet => "wallet",
                PaymentMethod.Installment => "calendar",
                _ => "payment"
            };
        }
    }
} 