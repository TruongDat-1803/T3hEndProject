using Xunit;
using Moq;
using AutoMapper;
using DemoApp.Application.Services;
using DemoApp.Application.Interfaces;
using DemoApp.Domain.Interfaces;
using DemoApp.Domain.Entities;
using DemoApp.Application.DTOs.Products;
using System.Collections.Generic;
using System.Threading.Tasks;

public class ProductServiceTests
{
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly ProductService _service;

    public ProductServiceTests()
    {
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _mapperMock = new Mock<IMapper>();
        _service = new ProductService(_unitOfWorkMock.Object, _mapperMock.Object);
    }

    [Fact]
    public async Task GetAllProductsAsync_ReturnsProductDtos()
    {
        // Arrange
        var products = new List<Product> { new Product { ProductId = 1, ProductName = "Test Product" } };
        _unitOfWorkMock.Setup(u => u.Products.GetAllAsync()).ReturnsAsync(products);
        _mapperMock.Setup(m => m.Map<IEnumerable<ProductDto>>(products)).Returns(new List<ProductDto> { new ProductDto { ProductId = 1, ProductName = "Test Product" } });

        // Act
        var result = await _service.GetAllProductsAsync();

        // Assert
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("Test Product", ((List<ProductDto>)result)[0].ProductName);
        Assert.Equal(1, ((List<ProductDto>)result)[0].ProductId);
    }
} 