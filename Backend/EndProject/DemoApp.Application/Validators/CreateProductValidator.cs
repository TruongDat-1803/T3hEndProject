using FluentValidation;
using DemoApp.Application.DTOs.Products;

namespace DemoApp.Application.Validators
{
    public class CreateProductValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.ProductName)
                .NotEmpty().WithMessage("Product name is required.")
                .MaximumLength(200).WithMessage("Product name cannot exceed 200 characters.");

            RuleFor(x => x.SKU)
                .NotEmpty().WithMessage("SKU is required.")
                .MaximumLength(50).WithMessage("SKU cannot exceed 50 characters.")
                .Matches("^[A-Z0-9-]+$").WithMessage("SKU can only contain uppercase letters, numbers, and hyphens.");

            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Price must be greater than 0.");

            RuleFor(x => x.OriginalPrice)
                .GreaterThan(0).When(x => x.OriginalPrice.HasValue)
                .WithMessage("Original price must be greater than 0 when specified.");

            RuleFor(x => x.DiscountPercentage)
                .InclusiveBetween(0, 100).WithMessage("Discount percentage must be between 0 and 100.");

            RuleFor(x => x.StockQuantity)
                .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative.");

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("Category ID is required.");

            RuleFor(x => x.BrandId)
                .GreaterThan(0).WithMessage("Brand ID is required.");

            RuleFor(x => x.ShortDescription)
                .MaximumLength(500).When(x => !string.IsNullOrEmpty(x.ShortDescription))
                .WithMessage("Short description cannot exceed 500 characters.");

            RuleFor(x => x.Weight)
                .GreaterThan(0).When(x => x.Weight.HasValue)
                .WithMessage("Weight must be greater than 0 when specified.");

            RuleFor(x => x.Dimensions)
                .MaximumLength(100).When(x => !string.IsNullOrEmpty(x.Dimensions))
                .WithMessage("Dimensions cannot exceed 100 characters.");
        }
    }
} 