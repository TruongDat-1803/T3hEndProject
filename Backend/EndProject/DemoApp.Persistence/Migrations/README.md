# Entity Framework Migrations

## Tạo Migration đầu tiên

Chạy lệnh sau trong thư mục `DemoApp.Persistence`:

```bash
dotnet ef migrations add InitialCreate --startup-project ../DemoApp.Api
```

## Cập nhật Database

Chạy lệnh sau để cập nhật database:

```bash
dotnet ef database update --startup-project ../DemoApp.Api
```

## Xóa Migration cuối cùng

Nếu cần xóa migration cuối cùng:

```bash
dotnet ef migrations remove --startup-project ../DemoApp.Api
```

## Tạo Migration mới

Khi có thay đổi trong entities:

```bash
dotnet ef migrations add [MigrationName] --startup-project ../DemoApp.Api
```

## Lưu ý

- Đảm bảo connection string trong `appsettings.json` đúng
- Chạy database script `Database/eCommerce_Database.sql` trước khi tạo migration
- Migration sẽ tạo schema dựa trên entities trong Domain layer 