using DemoApp.Domain.Interfaces;
using DemoApp.Persistence.Data;
using DemoApp.Persistence.Repositories;
using DemoApp.Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage;

namespace DemoApp.Persistence.UnitOfWork
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        // Repository properties
        public IRepository<User> Users { get; }
        public IRepository<UserRole> UserRoles { get; }
        public IRepository<Category> Categories { get; }
        public IRepository<Brand> Brands { get; }
        public IRepository<Product> Products { get; }
        public IRepository<ProductSpecification> ProductSpecifications { get; }
        public IRepository<ProductImage> ProductImages { get; }
        public IRepository<ProductVariant> ProductVariants { get; }
        public IRepository<ShoppingCart> ShoppingCart { get; }
        public IRepository<Address> Addresses { get; }
        public IRepository<Order> Orders { get; }
        public IRepository<OrderItem> OrderItems { get; }
        public IRepository<ProductReview> ProductReviews { get; }
        public IRepository<Wishlist> Wishlist { get; }
        public IRepository<Coupon> Coupons { get; }
        public IRepository<Notification> Notifications { get; }

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            
            // Initialize repositories
            Users = new Repository<User>(context);
            UserRoles = new Repository<UserRole>(context);
            Categories = new Repository<Category>(context);
            Brands = new Repository<Brand>(context);
            Products = new Repository<Product>(context);
            ProductSpecifications = new Repository<ProductSpecification>(context);
            ProductImages = new Repository<ProductImage>(context);
            ProductVariants = new Repository<ProductVariant>(context);
            ShoppingCart = new Repository<ShoppingCart>(context);
            Addresses = new Repository<Address>(context);
            Orders = new Repository<Order>(context);
            OrderItems = new Repository<OrderItem>(context);
            ProductReviews = new Repository<ProductReview>(context);
            Wishlist = new Repository<Wishlist>(context);
            Coupons = new Repository<Coupon>(context);
            Notifications = new Repository<Notification>(context);
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                await _transaction?.CommitAsync();
            }
            catch
            {
                await RollbackAsync();
                throw;
            }
        }

        public async Task RollbackAsync()
        {
            await _transaction?.RollbackAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context?.Dispose();
        }
    }
} 