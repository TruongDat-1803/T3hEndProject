-- =============================================
-- Database Design for eCommerce Website
-- Selling Laptops and Phones
-- =============================================

-- Create Database
CREATE DATABASE eCommerceDB
GO

USE eCommerceDB
GO

-- =============================================
-- 1. USERS & AUTHENTICATION
-- =============================================

CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    PhoneNumber NVARCHAR(20),
    DateOfBirth DATE,
    Gender NVARCHAR(10) CHECK (Gender IN ('Male', 'Female', 'Other')),
    IsActive BIT DEFAULT 1,
    IsEmailVerified BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
)

CREATE TABLE UserRoles (
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) UNIQUE NOT NULL,
    Description NVARCHAR(255)
)

CREATE TABLE UserRoleMappings (
    UserId INT,
    RoleId INT,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (RoleId) REFERENCES UserRoles(RoleId)
)

-- =============================================
-- 2. CATEGORIES & PRODUCTS
-- =============================================

CREATE TABLE Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    ParentCategoryId INT,
    IsActive BIT DEFAULT 1,
    DisplayOrder INT DEFAULT 0,
    ImageUrl NVARCHAR(255),
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ParentCategoryId) REFERENCES Categories(CategoryId)
)

CREATE TABLE Brands (
    BrandId INT IDENTITY(1,1) PRIMARY KEY,
    BrandName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    LogoUrl NVARCHAR(255),
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE()
)

CREATE TABLE Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    ShortDescription NVARCHAR(500),
    CategoryId INT NOT NULL,
    BrandId INT NOT NULL,
    SKU NVARCHAR(50) UNIQUE,
    Price DECIMAL(18,2) NOT NULL,
    OriginalPrice DECIMAL(18,2),
    DiscountPercentage DECIMAL(5,2) DEFAULT 0,
    StockQuantity INT DEFAULT 0,
    Weight DECIMAL(10,2),
    Dimensions NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    IsFeatured BIT DEFAULT 0,
    ViewCount INT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId),
    FOREIGN KEY (BrandId) REFERENCES Brands(BrandId)
)

-- =============================================
-- 3. PRODUCT SPECIFICATIONS (for Phones & Laptops)
-- =============================================

CREATE TABLE ProductSpecifications (
    SpecificationId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    SpecificationType NVARCHAR(50) NOT NULL, -- 'Display', 'Processor', 'RAM', etc.
    SpecificationName NVARCHAR(100) NOT NULL,
    SpecificationValue NVARCHAR(500) NOT NULL,
    DisplayOrder INT DEFAULT 0,
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
)

-- =============================================
-- 4. PRODUCT IMAGES
-- =============================================

CREATE TABLE ProductImages (
    ImageId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    ImageUrl NVARCHAR(255) NOT NULL,
    AltText NVARCHAR(100),
    IsPrimary BIT DEFAULT 0,
    DisplayOrder INT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
)

-- =============================================
-- 5. PRODUCT VARIANTS (Color, Storage, etc.)
-- =============================================

CREATE TABLE ProductVariants (
    VariantId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    VariantName NVARCHAR(100) NOT NULL, -- 'Color', 'Storage', 'RAM'
    VariantValue NVARCHAR(100) NOT NULL, -- 'Red', '256GB', '8GB'
    PriceAdjustment DECIMAL(18,2) DEFAULT 0,
    StockQuantity INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
)

-- =============================================
-- 6. ADDRESSES
-- =============================================

CREATE TABLE Addresses (
    AddressId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    AddressType NVARCHAR(20) DEFAULT 'Shipping', -- 'Shipping', 'Billing'
    FullName NVARCHAR(100) NOT NULL,
    PhoneNumber NVARCHAR(20) NOT NULL,
    AddressLine1 NVARCHAR(200) NOT NULL,
    AddressLine2 NVARCHAR(200),
    City NVARCHAR(100) NOT NULL,
    State NVARCHAR(100) NOT NULL,
    PostalCode NVARCHAR(20) NOT NULL,
    Country NVARCHAR(100) DEFAULT 'Vietnam',
    IsDefault BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
)

-- =============================================
-- 7. ORDERS & ORDER ITEMS
-- =============================================

CREATE TABLE Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    OrderNumber NVARCHAR(50) UNIQUE NOT NULL,
    UserId INT NOT NULL,
    OrderStatus NVARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
    OrderDate DATETIME DEFAULT GETDATE(),
    ShippingAddressId INT NOT NULL,
    BillingAddressId INT NOT NULL,
    SubTotal DECIMAL(18,2) NOT NULL,
    TaxAmount DECIMAL(18,2) DEFAULT 0,
    ShippingAmount DECIMAL(18,2) DEFAULT 0,
    DiscountAmount DECIMAL(18,2) DEFAULT 0,
    TotalAmount DECIMAL(18,2) NOT NULL,
    PaymentMethod NVARCHAR(50), -- 'COD', 'CreditCard', 'BankTransfer'
    PaymentStatus NVARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Paid', 'Failed'
    Notes NVARCHAR(500),
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ShippingAddressId) REFERENCES Addresses(AddressId),
    FOREIGN KEY (BillingAddressId) REFERENCES Addresses(AddressId)
)

CREATE TABLE OrderItems (
    OrderItemId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    ProductName NVARCHAR(200) NOT NULL,
    SKU NVARCHAR(50) NOT NULL,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    VariantDetails NVARCHAR(500), -- JSON string for variant combinations
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
)

-- =============================================
-- 8. SHOPPING CART
-- =============================================

CREATE TABLE ShoppingCart (
    CartId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL DEFAULT 1,
    VariantDetails NVARCHAR(500), -- JSON string for selected variants
    AddedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
)

-- =============================================
-- 9. REVIEWS & RATINGS
-- =============================================

CREATE TABLE ProductReviews (
    ReviewId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    UserId INT NOT NULL,
    OrderId INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Title NVARCHAR(200),
    Comment NVARCHAR(1000),
    IsVerified BIT DEFAULT 0,
    IsApproved BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
)

-- =============================================
-- 10. WISHLIST
-- =============================================

CREATE TABLE Wishlist (
    WishlistId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ProductId INT NOT NULL,
    AddedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    UNIQUE(UserId, ProductId)
)

-- =============================================
-- 11. COUPONS & DISCOUNTS
-- =============================================

CREATE TABLE Coupons (
    CouponId INT IDENTITY(1,1) PRIMARY KEY,
    CouponCode NVARCHAR(50) UNIQUE NOT NULL,
    Description NVARCHAR(200),
    DiscountType NVARCHAR(20) NOT NULL, -- 'Percentage', 'FixedAmount'
    DiscountValue DECIMAL(18,2) NOT NULL,
    MinimumOrderAmount DECIMAL(18,2) DEFAULT 0,
    MaximumDiscountAmount DECIMAL(18,2),
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    UsageLimit INT,
    UsedCount INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE()
)

CREATE TABLE OrderCoupons (
    OrderId INT NOT NULL,
    CouponId INT NOT NULL,
    DiscountAmount DECIMAL(18,2) NOT NULL,
    PRIMARY KEY (OrderId, CouponId),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    FOREIGN KEY (CouponId) REFERENCES Coupons(CouponId)
)

-- =============================================
-- 12. NOTIFICATIONS
-- =============================================

CREATE TABLE Notifications (
    NotificationId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Message NVARCHAR(500) NOT NULL,
    NotificationType NVARCHAR(50), -- 'Order', 'Promotion', 'System'
    IsRead BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
)

-- =============================================
-- INSERT INITIAL DATA
-- =============================================

-- Insert User Roles
INSERT INTO UserRoles (RoleName, Description) VALUES
('Admin', 'System Administrator'),
('Customer', 'Regular Customer'),
('Manager', 'Store Manager')

-- Insert Categories
INSERT INTO Categories (CategoryName, Description, DisplayOrder) VALUES
(N'Điện thoại', N'Các loại điện thoại di động', 1),
(N'Laptop', N'Máy tính xách tay', 2),
(N'Phụ kiện', N'Phụ kiện điện thoại và laptop', 3)

-- Insert Sub-categories for Phones
INSERT INTO Categories (CategoryName, Description, ParentCategoryId, DisplayOrder) VALUES
(N'iPhone', N'Điện thoại iPhone', 1, 1),
(N'Samsung', N'Điện thoại Samsung', 1, 2),
(N'Xiaomi', N'Điện thoại Xiaomi', 1, 3),
(N'OPPO', N'Điện thoại OPPO', 1, 4),
(N'Vivo', N'Điện thoại Vivo', 1, 5)

-- Insert Sub-categories for Laptops
INSERT INTO Categories (CategoryName, Description, ParentCategoryId, DisplayOrder) VALUES
(N'Laptop Gaming', N'Laptop chơi game', 2, 1),
(N'Laptop Văn phòng', N'Laptop công việc', 2, 2),
(N'MacBook', N'Laptop Apple', 2, 3)

-- Insert Brands
INSERT INTO Brands (BrandName, Description) VALUES
(N'Apple', N'Apple Inc.'),
(N'Samsung', N'Samsung Electronics'),
(N'Xiaomi', N'Xiaomi Corporation'),
(N'OPPO', N'OPPO Electronics'),
(N'Vivo', N'Vivo Communication Technology'),
(N'ASUS', N'ASUSTeK Computer Inc.'),
(N'Dell', N'Dell Technologies'),
(N'HP', N'Hewlett-Packard'),
(N'Lenovo', N'Lenovo Group Limited'),
(N'MSI', N'Micro-Star International')

-- Insert Sample Products
INSERT INTO Products (ProductName, Description, CategoryId, BrandId, SKU, Price, OriginalPrice, StockQuantity) VALUES
(N'iPhone 15 Pro Max', N'iPhone 15 Pro Max 256GB Chính hãng VN/A', 4, 1, 'IP15PM-256', 29990000, 31990000, 50),
(N'Samsung Galaxy S24 Ultra', N'Samsung Galaxy S24 Ultra 256GB Chính hãng', 5, 2, 'SS24U-256', 25990000, 27990000, 30),
(N'MacBook Pro M3', N'MacBook Pro 14 inch M3 512GB', 9, 1, 'MBP14-M3-512', 45990000, 47990000, 20),
(N'ASUS ROG Strix G16', N'Laptop Gaming ASUS ROG Strix G16 RTX 4060', 6, 6, 'ASUS-ROG-G16', 32990000, 34990000, 15)

-- Insert Product Specifications
INSERT INTO ProductSpecifications (ProductId, SpecificationType, SpecificationName, SpecificationValue, DisplayOrder) VALUES
(1, N'Display', N'Màn hình', N'6.7 inch Super Retina XDR OLED', 1),
(1, N'Processor', N'Chip', N'A17 Pro', 2),
(1, N'Storage', N'Bộ nhớ', N'256GB', 3),
(1, N'Camera', N'Camera sau', N'48MP + 12MP + 12MP', 4),
(2, N'Display', N'Màn hình', N'6.8 inch Dynamic AMOLED 2X', 1),
(2, N'Processor', N'Chip', N'Snapdragon 8 Gen 3', 2),
(2, N'Storage', N'Bộ nhớ', N'256GB', 3),
(2, N'Camera', N'Camera sau', N'200MP + 12MP + 50MP + 10MP', 4)

-- Insert Product Images
INSERT INTO ProductImages (ProductId, ImageUrl, AltText, IsPrimary, DisplayOrder) VALUES
(1, '/images/products/iphone-15-pro-max-1.jpg', N'iPhone 15 Pro Max', 1, 1),
(1, '/images/products/iphone-15-pro-max-2.jpg', N'iPhone 15 Pro Max', 0, 2),
(2, '/images/products/samsung-s24-ultra-1.jpg', N'Samsung Galaxy S24 Ultra', 1, 1),
(2, '/images/products/samsung-s24-ultra-2.jpg', N'Samsung Galaxy S24 Ultra', 0, 2)

-- Insert Product Variants
INSERT INTO ProductVariants (ProductId, VariantName, VariantValue, PriceAdjustment, StockQuantity) VALUES
(1, N'Color', N'Titan tự nhiên', 0, 20),
(1, N'Color', N'Titan xanh', 0, 15),
(1, N'Color', N'Titan đen', 0, 15),
(1, N'Storage', N'128GB', -2000000, 10),
(1, N'Storage', N'512GB', 2000000, 10),
(2, N'Color', N'Titanium Gray', 0, 15),
(2, N'Color', N'Titanium Black', 0, 15),
(2, N'Storage', N'128GB', -2000000, 10),
(2, N'Storage', N'512GB', 2000000, 10)

-- Insert Sample Coupons
INSERT INTO Coupons (CouponCode, Description, DiscountType, DiscountValue, MinimumOrderAmount, StartDate, EndDate, UsageLimit) VALUES
('WELCOME10', N'Giảm 10% cho khách hàng mới', 'Percentage', 10, 1000000, '2024-01-01', '2024-12-31', 1000),
('SAVE500K', N'Giảm 500,000đ cho đơn hàng từ 5 triệu', 'FixedAmount', 500000, 5000000, '2024-01-01', '2024-12-31', 500)

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IX_Products_CategoryId ON Products(CategoryId)
CREATE INDEX IX_Products_BrandId ON Products(BrandId)
CREATE INDEX IX_Products_IsActive ON Products(IsActive)
CREATE INDEX IX_Products_IsFeatured ON Products(IsFeatured)
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(OrderId)
CREATE INDEX IX_OrderItems_ProductId ON OrderItems(ProductId)
CREATE INDEX IX_ShoppingCart_UserId ON ShoppingCart(UserId)
CREATE INDEX IX_ProductReviews_ProductId ON ProductReviews(ProductId)
CREATE INDEX IX_ProductSpecifications_ProductId ON ProductSpecifications(ProductId)
CREATE INDEX IX_ProductImages_ProductId ON ProductImages(ProductId)
CREATE INDEX IX_ProductVariants_ProductId ON ProductVariants(ProductId)

-- =============================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =============================================

-- View for Product Details with Brand and Category
CREATE VIEW vw_ProductDetails AS
SELECT 
    p.ProductId,
    p.ProductName,
    p.Description,
    p.ShortDescription,
    p.SKU,
    p.Price,
    p.OriginalPrice,
    p.DiscountPercentage,
    p.StockQuantity,
    p.IsActive,
    p.IsFeatured,
    p.ViewCount,
    c.CategoryName,
    c.CategoryId,
    b.BrandName,
    b.BrandId,
    (SELECT TOP 1 ImageUrl FROM ProductImages WHERE ProductId = p.ProductId AND IsPrimary = 1) as PrimaryImage
FROM Products p
INNER JOIN Categories c ON p.CategoryId = c.CategoryId
INNER JOIN Brands b ON p.BrandId = b.BrandId

-- View for Product with Average Rating
CREATE VIEW vw_ProductWithRating AS
SELECT 
    pd.*,
    AVG(CAST(pr.Rating AS FLOAT)) as AverageRating,
    COUNT(pr.ReviewId) as ReviewCount
FROM vw_ProductDetails pd
LEFT JOIN ProductReviews pr ON pd.ProductId = pr.ProductId AND pr.IsApproved = 1
GROUP BY 
    pd.ProductId, pd.ProductName, pd.Description, pd.ShortDescription, pd.SKU,
    pd.Price, pd.OriginalPrice, pd.DiscountPercentage, pd.StockQuantity,
    pd.IsActive, pd.IsFeatured, pd.ViewCount, pd.CategoryName, pd.CategoryId,
    pd.BrandName, pd.BrandId, pd.PrimaryImage

PRINT 'Database created successfully!' 