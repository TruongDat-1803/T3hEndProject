using DemoApp.Domain.Entities;

namespace DemoApp.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        // Repository properties
        IRepository<User> Users { get; }
        IRepository<UserRole> UserRoles { get; }
        IRepository<Category> Categories { get; }
        IRepository<Brand> Brands { get; }
        IRepository<Product> Products { get; }
        IRepository<ProductSpecification> ProductSpecifications { get; }
        IRepository<ProductImage> ProductImages { get; }
        IRepository<ProductVariant> ProductVariants { get; }
        IRepository<ShoppingCart> ShoppingCart { get; }
        IRepository<Address> Addresses { get; }
        IRepository<Order> Orders { get; }
        IRepository<OrderItem> OrderItems { get; }
        IRepository<ProductReview> ProductReviews { get; }
        IRepository<Wishlist> Wishlist { get; }
        IRepository<Coupon> Coupons { get; }
        IRepository<Notification> Notifications { get; }

        // Transaction operations
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
        Task<int> SaveChangesAsync();
    }
} 