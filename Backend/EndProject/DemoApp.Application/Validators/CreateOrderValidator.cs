using FluentValidation;
using DemoApp.Application.DTOs.Orders;

namespace DemoApp.Application.Validators
{
    public class CreateOrderValidator : AbstractValidator<CreateOrderDto>
    {
        public CreateOrderValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("User ID is required.");

            RuleFor(x => x.PaymentMethod)
                .IsInEnum().WithMessage("Payment method must be a valid value.");

            RuleFor(x => x.OrderItems)
                .NotEmpty().WithMessage("Order must have at least one item.");

            RuleForEach(x => x.OrderItems).SetValidator(new CreateOrderItemValidator());

            RuleFor(x => x.ShippingAddressId)
                .GreaterThan(0).WithMessage("Shipping address is required.");
            RuleFor(x => x.BillingAddressId)
                .GreaterThan(0).WithMessage("Billing address is required.");

            RuleFor(x => x.Notes)
                .MaximumLength(1000).When(x => !string.IsNullOrEmpty(x.Notes))
                .WithMessage("Notes cannot exceed 1000 characters.");
        }
    }

    public class CreateOrderItemValidator : AbstractValidator<CreateOrderItemDto>
    {
        public CreateOrderItemValidator()
        {
            RuleFor(x => x.ProductId)
                .GreaterThan(0).WithMessage("Product ID is required.");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than 0.");

            RuleFor(x => x.VariantDetails)
                .MaximumLength(200).When(x => !string.IsNullOrEmpty(x.VariantDetails))
                .WithMessage("Variant details cannot exceed 200 characters.");
        }
    }
} 