CREATE TABLE Users (
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) UNIQUE NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    Phone NVARCHAR(15),
    Address NVARCHAR(500),
    City NVARCHAR(100),
    District NVARCHAR(100),
    Ward NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    Role NVARCHAR(20) DEFAULT 'Customer', -- Customer, Admin
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE Categories (
    CategoryId INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    ParentCategoryId INT,
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ParentCategoryId) REFERENCES Categories(CategoryId)
);

CREATE TABLE Brands (
    BrandId INT IDENTITY(1,1) PRIMARY KEY,
    BrandName NVARCHAR(100) NOT NULL,
    Logo NVARCHAR(255),
    Description NVARCHAR(500),
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    ProductName NVARCHAR(200) NOT NULL,
    SKU NVARCHAR(50) UNIQUE NOT NULL,
    CategoryId INT NOT NULL,
    BrandId INT NOT NULL,
    Description NVARCHAR(MAX),
    ShortDescription NVARCHAR(500),
    Price DECIMAL(18,2) NOT NULL,
    SalePrice DECIMAL(18,2),
    CostPrice DECIMAL(18,2),
    StockQuantity INT DEFAULT 0,
    Weight DECIMAL(10,2),
    Dimensions NVARCHAR(100),
    Warranty NVARCHAR(100),
    IsActive BIT DEFAULT 1,
    IsFeatured BIT DEFAULT 0,
    ViewCount INT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    UpdatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId),
    FOREIGN KEY (BrandId) REFERENCES Brands(BrandId)
);

CREATE TABLE ProductImages (
    ImageId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    ImageUrl NVARCHAR(500) NOT NULL,
    IsPrimary BIT DEFAULT 0,
    SortOrder INT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);

CREATE TABLE ProductSpecifications (
    SpecificationId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    SpecificationName NVARCHAR(100) NOT NULL,
    SpecificationValue NVARCHAR(500) NOT NULL,
    SortOrder INT DEFAULT 0,
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);

CREATE TABLE ProductVariants (
    VariantId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    VariantName NVARCHAR(100) NOT NULL, -- Ví dụ: "Đen 128GB", "Trắng 256GB"
    Price DECIMAL(18,2),
    StockQuantity INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);

CREATE TABLE Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    OrderNumber NVARCHAR(50) UNIQUE NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(18,2) NOT NULL,
    DiscountAmount DECIMAL(18,2) DEFAULT 0,
    ShippingFee DECIMAL(18,2) DEFAULT 0,
    FinalAmount DECIMAL(18,2) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Pending', -- Pending, Confirmed, Shipping, Delivered, Cancelled
    PaymentMethod NVARCHAR(50), -- COD, Banking, Credit Card
    PaymentStatus NVARCHAR(50) DEFAULT 'Pending', -- Pending, Paid, Failed
    ShippingAddress NVARCHAR(500),
    ShippingPhone NVARCHAR(15),
    ShippingName NVARCHAR(100),
    Notes NVARCHAR(500),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE OrderDetails (
    OrderDetailId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    ProductId INT NOT NULL,
    VariantId INT,
    Quantity INT NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    TotalPrice DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    FOREIGN KEY (VariantId) REFERENCES ProductVariants(VariantId)
);

CREATE TABLE ShoppingCart (
    CartId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ProductId INT NOT NULL,
    VariantId INT,
    Quantity INT NOT NULL,
    AddedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    FOREIGN KEY (VariantId) REFERENCES ProductVariants(VariantId)
);

CREATE TABLE ProductReviews (
    ReviewId INT IDENTITY(1,1) PRIMARY KEY,
    ProductId INT NOT NULL,
    UserId INT NOT NULL,
    OrderId INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    Comment NVARCHAR(1000),
    IsApproved BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (OrderId) REFERENCES Orders(OrderId)
);

CREATE TABLE Promotions (
    PromotionId INT IDENTITY(1,1) PRIMARY KEY,
    PromotionName NVARCHAR(200) NOT NULL,
    PromotionCode NVARCHAR(50) UNIQUE,
    DiscountType NVARCHAR(20) NOT NULL, -- Percentage, FixedAmount
    DiscountValue DECIMAL(18,2) NOT NULL,
    MinimumOrderAmount DECIMAL(18,2),
    MaximumDiscount DECIMAL(18,2),
    StartDate DATETIME NOT NULL,
    EndDate DATETIME NOT NULL,
    UsageLimit INT,
    UsedCount INT DEFAULT 0,
    IsActive BIT DEFAULT 1,
    CreatedDate DATETIME DEFAULT GETDATE()
);

CREATE TABLE UserPromotions (
    UserPromotionId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    PromotionId INT NOT NULL,
    IsUsed BIT DEFAULT 0,
    UsedDate DATETIME,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (PromotionId) REFERENCES Promotions(PromotionId)
);

CREATE TABLE Wishlist (
    WishlistId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ProductId INT NOT NULL,
    AddedDate DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (ProductId) REFERENCES Products(ProductId)
);

-- Index cho tìm kiếm sản phẩm
CREATE INDEX IX_Products_CategoryId ON Products(CategoryId);
CREATE INDEX IX_Products_BrandId ON Products(BrandId);
CREATE INDEX IX_Products_Price ON Products(Price);
CREATE INDEX IX_Products_IsActive ON Products(IsActive);

-- Index cho đơn hàng
CREATE INDEX IX_Orders_UserId ON Orders(UserId);
CREATE INDEX IX_Orders_Status ON Orders(Status);
CREATE INDEX IX_Orders_OrderDate ON Orders(OrderDate);

-- Index cho giỏ hàng
CREATE INDEX IX_ShoppingCart_UserId ON ShoppingCart(UserId);

SELECT * From [Categories]
SELECT * From [Brands]
SELECT * From [Products]
-- Thêm danh mục
INSERT INTO Categories (CategoryName, Description) VALUES
(N'Điện thoại', N'Các loại điện thoại di động'),
(N'Laptop', N'Các loại máy tính xách tay'),
(N'Điện thoại Android', N'Điện thoại chạy hệ điều hành Android'),
(N'Điện thoại iPhone', N'Điện thoại Apple iPhone'),
(N'Laptop Gaming', N'Laptop chuyên game'),
(N'Laptop Văn phòng', N'Laptop dành cho công việc văn phòng');

-- Thêm thương hiệu
INSERT INTO Brands (BrandName, Description) VALUES
(N'Apple', N'Thương hiệu công nghệ hàng đầu thế giới'),
(N'Samsung', N'Tập đoàn công nghệ Hàn Quốc'),
(N'Xiaomi', N'Thương hiệu công nghệ Trung Quốc'),
(N'ASUS', N'Thương hiệu laptop và máy tính'),
(N'Dell', N'Tập đoàn công nghệ Mỹ'),
(N'HP', N'Hewlett-Packard - Tập đoàn công nghệ Mỹ');

-- Thêm sản phẩm mẫu
INSERT INTO Products (ProductName, SKU, CategoryId, BrandId, Description, Price, StockQuantity, IsActive) VALUES
(N'iPhone 15 Pro Max', 'IP15PM-256', 4, 1, N'iPhone 15 Pro Max 256GB - Điện thoại cao cấp nhất của Apple', 29990000, 50, 1),
(N'Samsung Galaxy S24 Ultra', 'SGS24U-512', 3, 2, N'Samsung Galaxy S24 Ultra 512GB - Flagship Android', 24990000, 30, 1),
(N'Xiaomi Redmi Note 13 Pro', 'XRN13P-128', 3, 3, N'Xiaomi Redmi Note 13 Pro 128GB - Điện thoại tầm trung', 5990000, 100, 1),
(N'ASUS ROG Strix G16', 'ASRG16-1TB', 5, 4, N'Laptop Gaming ASUS ROG Strix G16 RTX 4060', 25990000, 20, 1),
(N'Dell Inspiron 15', 'DI15-512', 6, 5, N'Laptop Văn phòng Dell Inspiron 15', 15990000, 25, 1),
(N'HP Pavilion 14', 'HPP14-256', 6, 6, N'Laptop Văn phòng HP Pavilion 14', 12990000, 15, 1);

-- Thêm hình ảnh sản phẩm
INSERT INTO ProductImages (ProductId, ImageUrl, IsPrimary, SortOrder) VALUES
(1, '/images/products/iphone-15-pro-max-1.jpg', 1, 1),
(1, '/images/products/iphone-15-pro-max-2.jpg', 0, 2),
(2, '/images/products/samsung-s24-ultra-1.jpg', 1, 1),
(2, '/images/products/samsung-s24-ultra-2.jpg', 0, 2),
(3, '/images/products/xiaomi-redmi-note-13-pro-1.jpg', 1, 1),
(4, '/images/products/asus-rog-strix-g16-1.jpg', 1, 1),
(5, '/images/products/dell-inspiron-15-1.jpg', 1, 1),
(6, '/images/products/hp-pavilion-14-1.jpg', 1, 1);

-- Thêm thông số kỹ thuật
INSERT INTO ProductSpecifications (ProductId, SpecificationName, SpecificationValue, SortOrder) VALUES
(1, N'Màn hình', N'6.7 inch OLED', 1),
(1, N'Chip', N'A17 Pro', 2),
(1, N'RAM', N'8GB', 3),
(1, N'Bộ nhớ', N'256GB', 4),
(1, N'Camera', N'48MP + 12MP + 12MP', 5),
(2, N'Màn hình', N'6.8 inch Dynamic AMOLED', 1),
(2, N'Chip', N'Snapdragon 8 Gen 3', 2),
(2, N'RAM', N'12GB', 3),
(2, N'Bộ nhớ', N'512GB', 4),
(2, N'Camera', N'200MP + 12MP + 50MP + 10MP', 5);

-- Thêm biến thể sản phẩm
INSERT INTO ProductVariants (ProductId, VariantName, Price, StockQuantity, IsActive) VALUES
(1, N'Đen 256GB', 29990000, 20, 1),
(1, N'Trắng 256GB', 29990000, 15, 1),
(1, N'Xanh 256GB', 29990000, 15, 1),
(2, N'Đen 512GB', 24990000, 15, 1),
(2, N'Trắng 512GB', 24990000, 15, 1),
(3, N'Đen 128GB', 5990000, 50, 1),
(3, N'Xanh 128GB', 5990000, 50, 1);

-- Thêm khuyến mãi
INSERT INTO Promotions (PromotionName, PromotionCode, DiscountType, DiscountValue, MinimumOrderAmount, StartDate, EndDate, IsActive) VALUES
(N'Giảm giá mùa hè', 'SUMMER2024', 'Percentage', 10.00, 1000000, '2024-01-01', '2024-12-31', 1),
(N'Giảm giá sinh nhật', 'BIRTHDAY', 'FixedAmount', 500000, 2000000, '2024-01-01', '2024-12-31', 1),
(N'Flash sale', 'FLASH50', 'Percentage', 50.00, 500000, '2024-01-01', '2024-12-31', 1);