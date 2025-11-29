# AgriBid Test Accounts

These test accounts have been seeded into the database and can be used for login testing.

## Test Accounts

### Farmer Account
- **Email:** farmer@agribid.com
- **Password:** password123
- **Role:** Farmer / Seller
- **Name:** John Farmer

### Buyer Account
- **Email:** buyer@agribid.com
- **Password:** password123
- **Role:** Buyer / Bidder
- **Name:** Jane Buyer

### Renter Account
- **Email:** renter@agribid.com
- **Password:** password123
- **Role:** Renter
- **Name:** Mike Renter

### Admin Account
- **Email:** admin@agribid.com
- **Password:** admin123
- **Role:** Farmer (Admin privileges)
- **Name:** Admin User

### General Test Account
- **Email:** test@agribid.com
- **Password:** test123
- **Role:** Farmer
- **Name:** Test User

## Notes

- All passwords are hashed using Laravel's `Hash::make()` function
- The `role` column has been added to the users table with values: 'farmer', 'buyer', or 'renter'
- To reset the database and reseed, run: `php artisan migrate:fresh --seed`
- For deployment, these accounts will be automatically created when running migrations and seeders

## Deployment Instructions

1. Set up your production database credentials in `.env`
2. Run migrations: `php artisan migrate`
3. Seed the database: `php artisan db:seed`

Or run both at once:
```bash
php artisan migrate:fresh --seed
```

## Security Note

Remember to change or remove these test accounts in production and use strong passwords!
