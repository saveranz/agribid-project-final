# Admin Dashboard Quick Reference

## 🚀 Quick Access

### Login Credentials
```
Email: admin@agribid.com
Password: admin123
URL: http://localhost:5173/admin
```

### Default Test Accounts
```
Farmer:  carlos.farmer@agribid.com  / password123
Buyer:   john.buyer@agribid.com     / password123
Admin:   admin@agribid.com          / admin123
```

## 📊 Features at a Glance

| Tab | Features |
|-----|----------|
| **Overview** | Statistics dashboard, totals for users/listings/bids/equipment |
| **Users** | Search, filter by role, delete users, export CSV |
| **Listings** | Approve/reject pending, view all statuses, export CSV |
| **Bids** | Monitor all auction bids, view status, export CSV |
| **Rentals** | View equipment inventory, status, ratings |
| **Reports** | Export 4 types of CSV reports (users, listings, bids, equipment) |

## 🔒 API Endpoints

```
GET    /api/v1/admin/users
GET    /api/v1/admin/statistics
POST   /api/v1/admin/listings/{id}/approve
POST   /api/v1/admin/listings/{id}/reject
DELETE /api/v1/admin/users/{id}
DELETE /api/v1/admin/listings/{id}
GET    /api/v1/admin/activity-logs
GET    /api/v1/admin/reports?type={type}
```

## 🛠️ Quick Commands

### Start Development Servers
```bash
# Backend (Laravel)
cd backend-laravel
php artisan serve

# Frontend (React)
cd frontend-react
npm run dev
```

### Database Operations
```bash
# Seed admin user
php artisan db:seed --class=UsersSeeder

# Reset everything
php artisan migrate:fresh --seed

# Clear caches
php artisan cache:clear && php artisan route:clear
```

### Verify Setup
```bash
# Check admin routes
php artisan route:list --path=admin

# Check for syntax errors
php -l app/Http/Controllers/Api/V1/AdminController.php

# List database users
# Run in MySQL: SELECT id, name, email, role FROM users;
```

## ✅ Quick Test Checklist

- [ ] Login with admin@agribid.com
- [ ] Navigate to /admin
- [ ] Dashboard loads (see statistics)
- [ ] Click Users tab (see user table)
- [ ] Search for a user
- [ ] Click Listings tab (see listing cards)
- [ ] Try approve/reject on pending listing
- [ ] Export any CSV report
- [ ] Toggle dark mode
- [ ] Logout

## 🐛 Common Issues

| Problem | Quick Fix |
|---------|-----------|
| 403 Forbidden | User role is not 'admin' in database |
| 404 Not Found | Run `php artisan route:clear` |
| Admin user doesn't exist | Run `php artisan db:seed --class=UsersSeeder` |
| CORS error | Check backend is running on port 8000 |
| Blank page | Check browser console for errors |

## 📁 Important Files

### Backend
```
app/Http/Controllers/Api/V1/AdminController.php    - Admin API
routes/api_v1.php                                   - Admin routes
database/seeders/UsersSeeder.php                    - Admin user seed
app/Http/Middleware/RoleMiddleware.php              - Authorization
```

### Frontend
```
src/pages/admin/AdminDashboard.jsx                  - Admin UI
src/api/axios.js                                    - API client
src/App.jsx                                         - Route config
```

### Documentation
```
ADMIN_DASHBOARD_GUIDE.md        - Complete user guide
ADMIN_TESTING_GUIDE.md          - Testing procedures
ADMIN_IMPLEMENTATION_SUMMARY.md - Technical details
ADMIN_QUICK_REFERENCE.md        - This file
```

## 🎯 Key Features

### ✅ Implemented
- User management (view, search, delete)
- Listing approval/rejection
- Bid monitoring
- Equipment rental tracking
- CSV report exports
- Dark mode
- Role-based access control
- Search and filters

### 🔜 Future Enhancements
- Pagination
- Date range filters
- Bulk actions
- Email notifications
- Activity audit log
- Chart visualizations

## 💾 Database Quick Reference

### Check Admin User
```sql
SELECT * FROM users WHERE email = 'admin@agribid.com';
```

### Create Test Pending Listing
```sql
UPDATE listings SET approval_status = 'pending' WHERE id = 1;
```

### Count Records
```sql
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM listings) as total_listings,
  (SELECT COUNT(*) FROM bids) as total_bids,
  (SELECT COUNT(*) FROM equipment) as total_equipment;
```

## 🔐 Security Notes

✅ **Protected by**:
- Sanctum authentication
- Role middleware (admin only)
- Self-delete protection
- Confirmation dialogs
- CORS configuration

⚠️ **Remember**:
- Change default password in production
- Enable HTTPS
- Add rate limiting
- Monitor failed login attempts

## 📱 Mobile Support

Admin dashboard is responsive and works on:
- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024+)
- ✅ Mobile (375x667+)

## 🎨 UI Components

### Tabs (6 total)
1. Overview - Statistics dashboard
2. Users - User management table
3. Listings - Listing approval grid
4. Bids - Bid monitoring table
5. Rentals - Equipment cards
6. Reports - CSV export buttons

### Actions
- **Green buttons** = Approve
- **Red buttons** = Reject/Delete
- **Blue buttons** = View/Edit
- **Gray buttons** = Export/Settings

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Page Load | < 2s | ✅ |
| API Response | < 500ms | ✅ |
| CSV Export | < 1s | ✅ |
| Search Filter | Instant | ✅ |

## 🆘 Need Help?

1. **User Guide**: Read `ADMIN_DASHBOARD_GUIDE.md`
2. **Testing**: Follow `ADMIN_TESTING_GUIDE.md`
3. **Technical**: Check `ADMIN_IMPLEMENTATION_SUMMARY.md`
4. **Issues**: Look at Laravel logs: `backend-laravel/storage/logs/laravel.log`
5. **Frontend Errors**: Open browser DevTools (F12) → Console tab

## 🚦 Status Indicators

### User Status
- 🟢 Active
- 🔴 Inactive

### Listing Status
- 🟡 Pending (needs approval)
- 🟢 Approved (live on marketplace)
- 🔴 Rejected (not published)
- 🔵 Sold (transaction complete)

### Equipment Status
- 🟢 Available (can be rented)
- 🟡 Rented (currently in use)
- 🔴 Maintenance (not available)

## 📞 Quick Support Checklist

Before asking for help:
1. ✅ Backend server running? (php artisan serve)
2. ✅ Frontend server running? (npm run dev)
3. ✅ Admin user exists in database?
4. ✅ Logged in as admin role?
5. ✅ Browser console shows errors?
6. ✅ Network tab shows 403 or 404?
7. ✅ Checked Laravel logs?

## 🎓 Learning Resources

### Laravel
- [Laravel Sanctum Docs](https://laravel.com/docs/sanctum)
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Middleware](https://laravel.com/docs/middleware)

### React
- [React Hooks](https://react.dev/reference/react)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)

---

**Last Updated**: December 2, 2024
**Version**: 1.0.0
**Status**: ✅ Fully Operational
