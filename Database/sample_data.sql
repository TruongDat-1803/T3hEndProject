-- === USER ROLES ===
INSERT INTO UserRoles (RoleName, Description) VALUES
('Admin', 'Administrator'),
('Customer', 'Regular customer');

-- === USERS ===
INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, IsActive, IsEmailVerified, CreatedDate)
VALUES
('tdat1803', 'td1803@gmail.com', '123456', N'Đạt', N'Trương', 1, 1, GETDATE()),
('test', 'test@gmail.com', '123456', 'Test', 'Nguyen', 1, 1, GETDATE()),
('carol', 'carol@gmail.com', '123456', 'Carol', 'Le', 1, 0, GETDATE()),
('dave', 'dave@gmail.com', '123456', 'Dave', 'Pham', 1, 0, GETDATE());

-- === USER ROLE MAPPINGS ===
INSERT INTO UserRoleMappings (UserId, RoleId) VALUES
(1, 1), -- Alice is Admin
(2, 2), -- Bob is Customer
(3, 2), -- Carol is Customer
(4, 2); -- Dave is Customer

-- === ADDRESSES ===
INSERT INTO Addresses (UserId, AddressType, FullName, PhoneNumber, AddressLine1, City, State, PostalCode, Country, IsDefault, CreatedDate)
VALUES
(1, 'Shipping', N'Đạt Trương', '0900000001', '123 Main St', 'Hanoi', 'HN', '100000', 'Vietnam', 1, GETDATE()),
(2, 'Shipping', 'Test Nguyen', '0900000002', '456 Second St', 'HCMC', 'SG', '700000', 'Vietnam', 1, GETDATE()),
(3, 'Shipping', 'Carol Le', '0900000003', '789 Third St', 'Da Nang', 'DN', '550000', 'Vietnam', 1, GETDATE()),
(4, 'Shipping', 'Dave Pham', '0900000004', '321 Fourth St', 'Can Tho', 'CT', '900000', 'Vietnam', 1, GETDATE());

-- === CATEGORIES ===
INSERT INTO Categories (CategoryName, Description, IsActive, CreatedDate)
VALUES
(N'Laptop', N'Tất cả các loại laptop', 1, GETDATE()),
(N'Điện thoại', N'Tất cả các loại điện thoại', 1, GETDATE());

-- === BRANDS ===
INSERT INTO Brands (BrandName, Description, IsActive, CreatedDate)
VALUES
(N'Mac', N'Thương hiệu laptop Mac', 1, GETDATE()),
(N'Acer', N'Thương hiệu laptop Acer', 1, GETDATE()),
(N'ASUS', N'Thương hiệu laptop ASUS', 1, GETDATE()),
(N'Lenovo', N'Thương hiệu laptop Lenovo', 1, GETDATE()),
(N'Dell', N'Thương hiệu laptop Dell', 1, GETDATE()),
(N'Iphone', N'Thương hiệu điện thoại Iphone', 1, GETDATE()),
(N'SamSung', N'Thương hiệu điện thoại SamSung', 1, GETDATE()),
(N'Xiaomi', N'Thương hiệu điện thoại Xiaomi', 1, GETDATE()),
(N'Oppo', N'Thương hiệu điện thoại Oppo', 1, GETDATE());

-- === PRODUCTS: Laptops ===
INSERT INTO Products (ProductName, Description, CategoryId, BrandId, SKU, Price, StockQuantity, IsActive, IsFeatured, CreatedDate)
VALUES
('TechBrand UltraBook 1', 'Lightweight laptop', 1, 1, 'LAPTOP-001', 1200, 10, 1, 1, GETDATE()),
('TechBrand UltraBook 2', 'Performance laptop', 1, 1, 'LAPTOP-002', 1500, 8, 1, 0, GETDATE()),
('TechBrand UltraBook 3', 'Budget laptop', 1, 1, 'LAPTOP-003', 800, 15, 1, 0, GETDATE()),
('TechBrand UltraBook 4', 'Gaming laptop', 1, 1, 'LAPTOP-004', 2000, 5, 1, 1, GETDATE()),
('TechBrand UltraBook 5', 'Business laptop', 1, 1, 'LAPTOP-005', 1300, 12, 1, 0, GETDATE()),
('TechBrand UltraBook 6', 'Student laptop', 1, 1, 'LAPTOP-006', 900, 20, 1, 0, GETDATE()),
('TechBrand UltraBook 7', 'Convertible laptop', 1, 1, 'LAPTOP-007', 1400, 7, 1, 0, GETDATE()),
('TechBrand UltraBook 8', 'Touchscreen laptop', 1, 1, 'LAPTOP-008', 1600, 6, 1, 1, GETDATE()),
('TechBrand UltraBook 9', 'High-end laptop', 1, 1, 'LAPTOP-009', 2200, 3, 1, 0, GETDATE()),
('TechBrand UltraBook 10', 'Entry-level laptop', 1, 1, 'LAPTOP-010', 700, 18, 1, 0, GETDATE());

-- === PRODUCTS: Smartphones ===
INSERT INTO Products (ProductName, Description, CategoryId, BrandId, SKU, Price, StockQuantity, IsActive, IsFeatured, CreatedDate)
VALUES
('PhoneMaker X1', 'Flagship smartphone', 2, 2, 'PHONE-001', 900, 25, 1, 1, GETDATE()),
('PhoneMaker X2', 'Midrange smartphone', 2, 2, 'PHONE-002', 600, 30, 1, 0, GETDATE()),
('PhoneMaker X3', 'Budget smartphone', 2, 2, 'PHONE-003', 300, 40, 1, 0, GETDATE()),
('PhoneMaker X4', 'Camera phone', 2, 2, 'PHONE-004', 800, 22, 1, 1, GETDATE()),
('PhoneMaker X5', 'Gaming phone', 2, 2, 'PHONE-005', 1000, 10, 1, 0, GETDATE()),
('PhoneMaker X6', 'Business phone', 2, 2, 'PHONE-006', 700, 18, 1, 0, GETDATE()),
('PhoneMaker X7', 'Compact phone', 2, 2, 'PHONE-007', 500, 35, 1, 0, GETDATE()),
('PhoneMaker X8', 'Large screen phone', 2, 2, 'PHONE-008', 950, 12, 1, 1, GETDATE()),
('PhoneMaker X9', 'Battery phone', 2, 2, 'PHONE-009', 650, 28, 1, 0, GETDATE()),
('PhoneMaker X10', 'Entry-level phone', 2, 2, 'PHONE-010', 250, 50, 1, 0, GETDATE());

-- === SẢN PHẨM MẪU: IPHONE 16 ===
-- Thêm sản phẩm Iphone 16
INSERT INTO Products (ProductName, Description, CategoryId, BrandId, SKU, Price, StockQuantity, IsActive, IsFeatured, CreatedDate)
VALUES
(N'Iphone 16', N'iPhone 16 Pro Max sở hữu chipset A18 Pro mạnh mẽ giúp xử lý nhanh mọi tác vụ, camera 48 MP zoom quang 5x cho ảnh nét, màn hình 6.9 inch sống động. Pin dung lượng cao của máy hỗ trợ phát video tới 33 tiếng, đáp ứng nhu cầu giải trí liên tục suốt ngày dài. Cùng với đó là thiết kế khung Titanium bền nhẹ, mang lại cảm giác sang trọng và chắc chắn khi cầm.', 2, 6, 'IP16-001', 30090000, 18, 1, 1, GETDATE());

-- Giả sử ProductId của Iphone 16 là 20 (sau các sản phẩm mẫu trước đó)
-- Thêm các phiên bản màu/dung lượng
INSERT INTO ProductVariants (ProductId, VariantName, VariantValue, PriceAdjustment, StockQuantity, IsActive) VALUES
(20, N'Màu', N'Titan Sa Mạc 256GB', 0, 6, 1),
(20, N'Màu', N'Titan Sa Mạc 512GB', 6700000, 4, 1),
(20, N'Màu', N'Titan Sa Mạc 1T', 12600000, 2, 1),
(20, N'Màu', N'Titan Trắng 256GB', 200000, 2, 1),
(20, N'Màu', N'Titan Trắng 512GB', 7500000, 2, 1),
(20, N'Màu', N'Titan Trắng 1T', 12900000, 1, 1),
(20, N'Màu', N'TiTan Đen 256GB', 200000, 1, 1),
(20, N'Màu', N'TiTan Đen 512GB', 7500000, 1, 1),
(20, N'Màu', N'TiTan Đen 1T', 12900000, 1, 1);

-- Thêm hình ảnh sản phẩm
INSERT INTO ProductImages (ProductId, ImageUrl, AltText, IsPrimary, DisplayOrder, CreatedDate) VALUES
(20, N'Images/iphone-16-pro-max.webp', N'Iphone 16 Pro Max', 1, 1, GETDATE()),
(20, N'Images/iphone-16-pro-max-2.webp', N'Iphone 16 Pro Max góc 2', 0, 2, GETDATE()),
(20, N'Images/iphone-16-pro-max-3.webp', N'Iphone 16 Pro Max góc 3', 0, 3, GETDATE()),
(20, N'Images/iphone-16-pro-max-4.webp', N'Iphone 16 Pro Max góc 4', 0, 4, GETDATE()),
(20, N'Images/iphone-16-pro-max-5.webp', N'Iphone 16 Pro Max góc 5', 0, 5, GETDATE()),
(20, N'Images/iphone-16-pro-max-6.webp', N'Iphone 16 Pro Max góc 6', 0, 6, GETDATE());

-- === PRODUCT VARIANTS (example for first laptop and phone) ===
INSERT INTO ProductVariants (ProductId, VariantName, VariantValue, PriceAdjustment, StockQuantity, IsActive)
VALUES
(1, 'RAM', '8GB', 0, 5, 1),
(1, 'RAM', '16GB', 200, 5, 1),
(11, 'Color', 'Black', 0, 10, 1),
(11, 'Color', 'Blue', 10, 15, 1);

-- === PRODUCT IMAGES (example for first laptop and phone) ===
INSERT INTO ProductImages (ProductId, ImageUrl, AltText, IsPrimary, DisplayOrder, CreatedDate)
VALUES
(1, 'https://example.com/laptop1.jpg', 'TechBrand UltraBook 1', 1, 1, GETDATE()),
(11, 'https://example.com/phone1.jpg', 'PhoneMaker X1', 1, 1, GETDATE());

-- === SHOPPING CART (example) ===
INSERT INTO ShoppingCart (UserId, ProductId, Quantity, AddedDate)
VALUES
(2, 1, 1, GETDATE()),
(3, 11, 2, GETDATE());

-- === WISHLIST (example) ===
INSERT INTO Wishlist (UserId, ProductId, AddedDate)
VALUES
(2, 2, GETDATE()),
(3, 12, GETDATE());

-- === COUPONS (example) ===
INSERT INTO Coupons (Code, Description, DiscountAmount, DiscountPercentage, MinOrderAmount, MaxDiscountAmount, StartDate, EndDate, IsActive, CreatedDate)
VALUES
('WELCOME10', '10% off for new users', NULL, 10, 100, 50, GETDATE(), DATEADD(day, 30, GETDATE()), 1, GETDATE());

-- === NOTIFICATIONS (example) ===
INSERT INTO Notifications (UserId, Message, IsRead, CreatedDate)
VALUES
(1, 'Welcome to the store, Alice!', 0, GETDATE()),
(2, 'Your order has shipped!', 0, GETDATE());

-- === ORDERS & ORDER ITEMS (example) ===
INSERT INTO Orders (OrderNumber, UserId, OrderStatus, OrderDate, ShippingAddressId, BillingAddressId, SubTotal, TaxAmount, ShippingAmount, DiscountAmount, TotalAmount, PaymentMethod, PaymentStatus, Notes, CreatedDate, UpdatedDate)
VALUES
('ORD-20240716-0001', 2, 'Pending', GETDATE(), 2, 2, 1200, 120, 10, 0, 1330, 'CreditCard', 'Pending', 'First order', GETDATE(), GETDATE());

INSERT INTO OrderItems (OrderId, ProductId, ProductName, SKU, Quantity, UnitPrice, TotalPrice, VariantDetails)
VALUES
(1, 1, 'TechBrand UltraBook 1', 'LAPTOP-001', 1, 1200, 1200, 'RAM:8GB'); 