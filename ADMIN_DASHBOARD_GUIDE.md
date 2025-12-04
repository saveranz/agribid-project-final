# Admin Dashboard Guide

## Overview
The Admin Dashboard is a comprehensive management interface for AgriBid platform administrators. It provides full control over users, listings, bids, equipment rentals, and system analytics.

## Access

### Admin Credentials
- **Email**: admin@agribid.com
- **Password**: admin123
- **Role**: admin

### Login Steps
1. Navigate to the login page
2. Enter admin credentials
3. After authentication, you'll be automatically redirected to `/admin`
4. The admin dashboard will load with all management features

## Features

### 1. Overview Dashboard
**Location**: `/admin` (default tab)

Displays critical system statistics:
- **Total Users**: Count of all registered users (farmers, buyers, renters)
- **Active Listings**: Number of approved listings currently available
- **Total Bids**: Count of all auction bids placed
- **Equipment**: Number of equipment items available for rent

### 2. User Management
**Location**: `/admin` → Users tab

Features:
- **View All Users**: Displays table with Name, Email, Role, Status
- **Search**: Filter users by name or email
- **Role Filter**: Filter by role (all, farmer, buyer, renter, admin)
- **Delete User**: Remove user accounts (admin cannot delete themselves)
- **User Status**: Active/Inactive badges

API Endpoint: `GET /api/v1/admin/users?search=&role=`

### 3. Listing Management
**Location**: `/admin` → Listings tab

Features:
- **Listing Grid**: Visual cards showing product image, title, seller, price
- **Status Badges**: Pending, Approved, Rejected, Sold
- **Approve/Reject**: Quick action buttons for pending listings
- **Rejection Reason**: Modal to provide feedback when rejecting
- **Delete Listing**: Remove listings completely

API Endpoints:
- `POST /api/v1/admin/listings/{id}/approve`
- `POST /api/v1/admin/listings/{id}/reject`
- `DELETE /api/v1/admin/listings/{id}`

### 4. Bid Monitoring
**Location**: `/admin` → Bids tab

Features:
- **Bid Table**: Shows Listing, Bidder, Amount, Status, Date
- **Real-time Updates**: View all auction bids across the platform
- **Status Tracking**: Pending, Accepted, Rejected, Expired
- **Listing Details**: Click-through to view related listing

API Endpoint: `GET /api/v1/admin/activity-logs` (includes bids)

### 5. Equipment Rental Management
**Location**: `/admin` → Rentals tab

Features:
- **Equipment Cards**: Visual display of all rental equipment
- **Status Indicators**: Available, Rented, Under Maintenance
- **Owner Information**: View equipment owners
- **Rate Display**: Daily rental rates
- **Rating System**: Average user ratings displayed

### 6. Reports & Analytics
**Location**: `/admin` → Reports tab

Available Reports:
1. **User Report**: All users with complete profile data
2. **Listing Report**: All listings with status and details
3. **Bid Report**: Complete bid history and analytics
4. **Equipment Report**: Rental equipment inventory and performance
5. **Order Report**: Transaction history

Features:
- **CSV Export**: Download any report as CSV file
- **Date Range Filter**: Filter reports by date (coming soon)
- **Quick Download**: One-click export buttons

API Endpoint: `GET /api/v1/admin/reports?type={type}`

## Technical Implementation

### Backend Routes
All admin routes are protected by authentication and role middleware:

```php
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::get('/statistics', [AdminController::class, 'getStatistics']);
    Route::post('/listings/{id}/approve', [AdminController::class, 'approveListing']);
    Route::post('/listings/{id}/reject', [AdminController::class, 'rejectListing']);
    Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
    Route::delete('/listings/{id}', [AdminController::class, 'deleteListing']);
    Route::get('/activity-logs', [AdminController::class, 'getActivityLogs']);
    Route::get('/reports', [AdminController::class, 'generateReport']);
});
```

### Frontend Route
Protected route in React Router:

```jsx
<Route 
  path="/admin/*" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### Security Features
1. **Role-Based Access Control (RBAC)**: Only users with `role = 'admin'` can access
2. **Sanctum Authentication**: All requests require valid auth token
3. **Self-Protection**: Admins cannot delete their own account
4. **Authorization Middleware**: `RoleMiddleware` validates admin role on every request

## Setup Instructions

### 1. Seed Admin User
Run the seeder to create the admin account:

```bash
php artisan db:seed --class=UsersSeeder
```

This creates:
- 1 Admin user (admin@agribid.com)
- 10 Farmers
- 10 Buyers

### 2. Verify Admin Routes
Check that routes are accessible:

```bash
php artisan route:list --path=admin
```

### 3. Test Admin Access
1. Login with admin credentials
2. Navigate to `/admin`
3. Verify all tabs are visible
4. Test user search, listing approval, and report downloads

## Common Tasks

### Approve a Listing
1. Go to Listings tab
2. Find pending listing
3. Click "Approve" button
4. Listing status changes to "approved" and appears in marketplace

### Reject a Listing
1. Go to Listings tab
2. Find pending listing
3. Click "Reject" button
4. Enter rejection reason in modal
5. Submit rejection

### Delete a User
1. Go to Users tab
2. Search for user by name/email
3. Click trash icon in user row
4. Confirm deletion
5. User is removed from database

### Export Reports
1. Go to Reports tab
2. Choose report type (Users, Listings, Bids, Equipment, Orders)
3. Click "Download CSV" button
4. CSV file downloads automatically

## Database Schema

### Admin-Related Tables
- **users**: Includes `role` field (farmer, buyer, renter, admin)
- **listings**: Has `status` field (pending, approved, rejected, sold)
- **bids**: Tracks auction bids with status
- **equipment**: Rental equipment inventory
- **orders**: Transaction records

## API Response Examples

### Get Statistics
```json
{
  "users": {
    "total": 21,
    "farmers": 10,
    "buyers": 10,
    "renters": 0,
    "admins": 1
  },
  "listings": {
    "total": 50,
    "approved": 45,
    "pending": 3,
    "rejected": 2,
    "sold": 12
  },
  "bids": {
    "total": 150,
    "active": 45
  },
  "equipment": {
    "total": 10,
    "available": 9,
    "rented": 1
  },
  "revenue": {
    "total": 125000,
    "this_month": 45000
  }
}
```

### Get Users
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@agribid.com",
      "role": "admin",
      "created_at": "2024-01-15T10:30:00Z",
      "is_active": true
    }
  ],
  "total": 21
}
```

## Troubleshooting

### Cannot Access Admin Dashboard
- **Issue**: Redirected or 403 Forbidden
- **Solution**: Verify user has `role = 'admin'` in database
- **Check**: Run `SELECT * FROM users WHERE email = 'admin@agribid.com'`

### Routes Not Found
- **Issue**: 404 on admin routes
- **Solution**: Clear route cache with `php artisan route:clear`

### Reports Not Downloading
- **Issue**: CSV export fails
- **Solution**: Check browser console for errors, verify API endpoint responds

### Statistics Show Zero
- **Issue**: Dashboard shows 0 for all counts
- **Solution**: Run database seeders to populate test data

## Future Enhancements

1. **Date Range Filtering**: Add date pickers to reports
2. **Advanced Search**: Multi-field search with operators
3. **Bulk Actions**: Approve/reject multiple listings at once
4. **Email Notifications**: Notify users of admin actions
5. **Activity Logging**: Track all admin actions with timestamps
6. **User Suspension**: Temporarily disable accounts instead of deletion
7. **Chart Visualizations**: Add graphs for statistics
8. **Dispute Resolution**: Handle buyer-seller disputes

## Support

For issues or questions:
- Check database tables for correct data structure
- Verify user role is set to 'admin'
- Review Laravel logs: `storage/logs/laravel.log`
- Check browser console for frontend errors
- Test API endpoints directly with Postman/curl

## Security Notes

⚠️ **Important Security Considerations**:
1. Change default admin password immediately in production
2. Use strong passwords for admin accounts
3. Enable two-factor authentication (future enhancement)
4. Regularly audit admin actions
5. Limit number of admin accounts
6. Monitor failed login attempts
7. Use HTTPS in production
