# Technical Context - E-Commerce Platform

## 🛠️ Technology Stack

### Backend Technologies
- **Framework**: ASP.NET Core 6.0
- **Database**: SQL Server 2019+
- **ORM**: Entity Framework Core 6.0
- **Authentication**: JWT Bearer Tokens
- **API Documentation**: Swagger/OpenAPI 3.0
- **Validation**: FluentValidation ✅
- **Mapping**: AutoMapper ✅
- **Logging**: Serilog (planned)

### Frontend Technologies (Planned)
- **Framework**: React.js 18+
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI v5
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Testing**: Jest + React Testing Library

### Development Tools
- **IDE**: Visual Studio 2022 / VS Code
- **Version Control**: Git
- **Package Manager**: NuGet (backend), npm (frontend)
- **Database Tools**: SQL Server Management Studio
- **API Testing**: Postman / Swagger UI

## 🔧 Development Environment Setup

### Prerequisites
```bash
# Required Software
- .NET 6.0 SDK
- SQL Server 2019+ (or LocalDB)
- Visual Studio 2022 / VS Code
- Node.js 16+ (for frontend)
- Git
```

### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd T3hEndProject/Backend/EndProject

# Restore packages
dotnet restore

# Run database migrations
dotnet ef database update --startup-project ../DemoApp.Api

# Run the application
dotnet run --project DemoApp.Api
```

### Database Setup
```sql
-- Create database
CREATE DATABASE eCommerceDB;
GO

-- Run the complete schema
-- File: Database/eCommerce_Clean.sql
```

### Configuration Files
```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=eCommerceDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "eCommerceAPI",
    "Audience": "eCommerceClient",
    "ExpirationMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

## 📦 Package Dependencies

### Backend Packages
```xml
<!-- DemoApp.Api -->
<PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="6.0.0" />
<PackageReference Include="Swashbuckle.AspNetCore" Version="6.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="6.0.0" />

<!-- DemoApp.Persistence -->
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="6.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="6.0.0" />

<!-- DemoApp.Application ✅ -->
<PackageReference Include="AutoMapper.Extensions.Microsoft.DependencyInjection" Version="11.0.0" />
<PackageReference Include="FluentValidation.AspNetCore" Version="10.0.0" />
<PackageReference Include="MediatR" Version="10.0.0" />
```

### Frontend Packages (Planned)
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@reduxjs/toolkit": "^1.8.0",
    "react-redux": "^8.0.0",
    "@mui/material": "^5.0.0",
    "@mui/icons-material": "^5.0.0",
    "axios": "^0.27.0",
    "react-router-dom": "^6.0.0",
    "react-hook-form": "^7.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^13.0.0",
    "@testing-library/jest-dom": "^5.16.0",
    "jest": "^27.0.0"
  }
}
```

## 🏗️ Architecture Constraints

### Clean Architecture Dependencies
```
Presentation Layer (API) → Application Layer → Domain Layer
Infrastructure Layer → Domain Layer
Persistence Layer → Domain Layer
```

### Layer Responsibilities
- **Domain Layer**: Business entities, interfaces, enums ✅
- **Application Layer**: Business logic, DTOs, services 🔄 (DTOs & Interfaces Complete)
- **Infrastructure Layer**: External services, file storage
- **Persistence Layer**: Data access, repositories ✅
- **Presentation Layer**: API controllers, middleware

### Dependency Injection Setup
```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(builder.Configuration);

// Add services to the container
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Add AutoMapper ✅
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

// Add FluentValidation ✅
builder.Services.AddFluentValidationAutoValidation();

// Register Application Services (Pending)
// builder.Services.AddScoped<IProductService, ProductService>();
// builder.Services.AddScoped<IUserService, UserService>();
// builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();

// Add authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        // JWT configuration
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader());
});
```

## 🔐 Security Configuration

### JWT Authentication
```csharp
public class JwtSettings
{
    public string SecretKey { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public int ExpirationMinutes { get; set; }
}

public class JwtTokenGenerator
{
    public string GenerateToken(User user, IEnumerable<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.UserName)
        };
        
        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }
        
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
```

### CORS Policy
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", builder =>
    {
        builder.WithOrigins("http://localhost:3000", "https://yourdomain.com")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});
```

## 🗄️ Database Configuration

### Connection String
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=eCommerceDB;Trusted_Connection=true;MultipleActiveResultSets=true;TrustServerCertificate=true"
  }
}
```

### Entity Framework Configuration
```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Entity configurations
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(e => e.Email).IsUnique();
        });
        
        // Additional configurations...
    }
}
```

## 🚀 Performance Considerations

### Caching Strategy
```csharp
// Memory Cache
builder.Services.AddMemoryCache();

// Distributed Cache (Redis - planned)
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});
```

### Database Optimization
```sql
-- Indexes for performance
CREATE INDEX IX_Products_CategoryId ON Products(CategoryId);
CREATE INDEX IX_Products_Price ON Products(Price);
CREATE INDEX IX_Orders_UserId_Status ON Orders(UserId, Status);

-- Views for common queries
CREATE VIEW vw_ProductSummary AS
SELECT p.Id, p.Name, p.Price, c.Name as CategoryName, b.Name as BrandName
FROM Products p
JOIN Categories c ON p.CategoryId = c.Id
JOIN Brands b ON p.BrandId = b.Id;
```

## 🧪 Testing Setup

### Unit Testing
```csharp
// Test project structure
DemoApp.Tests/
├── Unit/
│   ├── Services/
│   ├── Validators/
│   └── Repositories/
├── Integration/
│   ├── Controllers/
│   └── Database/
└── TestHelpers/
    ├── MockData/
    └── TestUtilities/
```

### Test Dependencies
```xml
<PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.0.0" />
<PackageReference Include="xunit" Version="2.4.0" />
<PackageReference Include="xunit.runner.visualstudio" Version="2.4.0" />
<PackageReference Include="Moq" Version="4.16.0" />
<PackageReference Include="FluentAssertions" Version="6.0.0" />
```

## 📊 Monitoring & Logging

### Logging Configuration
```csharp
builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
    // Serilog configuration (planned)
});
```

### Health Checks
```csharp
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>()
    .AddCheck<ExternalApiHealthCheck>("External API");
```

## 🔄 CI/CD Pipeline (Planned)

### GitHub Actions
```yaml
name: Build and Test
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup .NET
      uses: actions/setup-dotnet@v1
      with:
        dotnet-version: 6.0.x
    - name: Restore dependencies
      run: dotnet restore
    - name: Build
      run: dotnet build --no-restore
    - name: Test
      run: dotnet test --no-build --verbosity normal
```

## 🎯 Technical Constraints

### Performance Requirements
- **API Response Time**: < 500ms average
- **Database Query Time**: < 100ms for simple queries
- **Page Load Time**: < 3 seconds
- **Concurrent Users**: Support 1000+ concurrent users

### Security Requirements
- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control
- **Data Protection**: HTTPS only, input validation
- **SQL Injection**: Prevented via Entity Framework
- **XSS Protection**: Input sanitization

### Scalability Considerations
- **Database**: Proper indexing, connection pooling
- **Caching**: Memory cache for frequently accessed data
- **API**: Stateless design for horizontal scaling
- **File Storage**: Cloud storage for images and files

## 📊 Current Implementation Status

### ✅ Completed Components
- **Domain Layer**: 100% (15 entities, 3 enums, interfaces)
- **Infrastructure Layer**: 100% (EF Core, Repository, Unit of Work)
- **Database Design**: 100% (schema, sample data, indexes)
- **Application Layer Foundation**: 80% (DTOs, interfaces, AutoMapper)
- **Documentation**: 100% (architecture guide, progress summary)

### 🔄 Pending Components
- **Application Layer Services**: Business logic implementations
- **Validation Layer**: FluentValidation rules
- **API Layer**: Controllers and endpoints
- **Authentication**: JWT implementation
- **Testing**: Unit and integration tests
- **Frontend**: React application

This technical context provides the foundation for building a robust, scalable e-commerce platform following modern development practices and industry standards.
