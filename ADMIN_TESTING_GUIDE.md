# Admin Dashboard Testing Guide

## Quick Start

### 1. Login as Admin
```
Email: admin@agribid.com
Password: admin123
```

### 2. Access Admin Dashboard
After login, navigate to: `http://localhost:5173/admin`

## Testing Checklist

### ✅ Overview Tab
- [ ] Dashboard loads without errors
- [ ] Statistics cards display correct numbers:
  - Total Users
  - Active Listings  
  - Total Bids
  - Equipment
- [ ] Dark mode toggle works

### ✅ Users Tab
- [ ] User table displays all users
- [ ] Search box filters users by name/email
- [ ] Role filter dropdown works (all, farmer, buyer, renter, admin)
- [ ] Click trash icon on a user → confirmation dialog → user deleted
- [ ] Export button downloads CSV with user data
- [ ] Cannot delete own admin account

### ✅ Listings Tab
- [ ] Listing cards display with images
- [ ] Status badges show (pending/approved/rejected)
- [ ] For pending listings:
  - [ ] Click "Approve" → listing status changes to approved
  - [ ] Click "Reject" → modal asks for reason → listing rejected
- [ ] Export button downloads CSV

### ✅ Bids Tab
- [ ] Bid table shows all bids
- [ ] Columns display: Listing, Bidder, Amount, Status, Date
- [ ] Export button downloads CSV

### ✅ Rentals Tab
- [ ] Equipment cards display
- [ ] Shows: Name, Type, Rate, Status, Owner, Rating
- [ ] Export button downloads CSV

### ✅ Reports Tab
- [ ] 4 report download buttons visible:
  - [ ] Users Report (CSV)
  - [ ] Listings Report (CSV)
  - [ ] Bids Report (CSV)
  - [ ] Equipment Report (CSV)
- [ ] Each button downloads valid CSV file

## API Endpoint Tests

### Test with Browser Console or Postman

**Get Users**
```javascript
// In browser console
const response = await fetch('http://localhost:8000/api/v1/admin/users', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Accept': 'application/json'
  }
});
console.log(await response.json());
```

**Get Statistics**
```javascript
const response = await fetch('http://localhost:8000/api/v1/admin/statistics', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Accept': 'application/json'
  }
});
console.log(await response.json());
```

**Approve Listing**
```javascript
const response = await fetch('http://localhost:8000/api/v1/admin/listings/1/approve', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});
console.log(await response.json());
```

**Reject Listing**
```javascript
const response = await fetch('http://localhost:8000/api/v1/admin/listings/1/reject', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ reason: 'Invalid product' })
});
console.log(await response.json());
```

**Delete User**
```javascript
const response = await fetch('http://localhost:8000/api/v1/admin/users/5', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Accept': 'application/json'
  }
});
console.log(await response.json());
```

## Common Issues & Solutions

### Issue: 403 Forbidden on Admin Routes
**Cause**: User doesn't have admin role
**Solution**: Check database - `SELECT * FROM users WHERE email = 'admin@agribid.com'`
**Expected**: `role` field should be `'admin'`

### Issue: Admin user doesn't exist
**Solution**: Run seeder
```bash
php artisan db:seed --class=UsersSeeder
```

### Issue: Routes not found (404)
**Solution**: Clear route cache
```bash
php artisan route:clear
php artisan route:cache
```

### Issue: CORS errors
**Solution**: Backend should already have CORS configured. Verify in `config/cors.php`

### Issue: Token not being sent
**Solution**: Check that token is stored in localStorage after login:
```javascript
localStorage.getItem('token')
```

### Issue: AdminDashboard not rendering
**Solution**: Check browser console for errors. Common issues:
- Import paths (should be from `../../api/axios`)
- Missing dependencies in package.json

## Database Verification

### Check Admin User Exists
```sql
SELECT * FROM users WHERE role = 'admin';
```

Expected result:
```
id: 1
name: Admin User
email: admin@agribid.com
role: admin
```

### Check Pending Listings (for approval test)
```sql
SELECT * FROM listings WHERE approval_status = 'pending';
```

### Create Test Pending Listing
```sql
UPDATE listings SET approval_status = 'pending' WHERE id = 1;
```

## Performance Verification

### Check API Response Times
Open browser DevTools → Network tab → Filter by XHR

Expected response times:
- `/admin/users` - < 500ms
- `/admin/statistics` - < 300ms
- `/admin/activity-logs` - < 500ms
- `/admin/reports` - < 1000ms

## Security Verification

### Test Role-Based Access Control

1. **Login as farmer/buyer** (not admin)
2. **Try to access**: `http://localhost:5173/admin`
3. **Expected**: Redirect to dashboard or 403 error
4. **Try API directly**:
```javascript
// Should get 403 Forbidden
fetch('http://localhost:8000/api/v1/admin/users', {
  headers: {
    'Authorization': 'Bearer FARMER_TOKEN',
    'Accept': 'application/json'
  }
})
```

### Test Self-Delete Protection
1. Login as admin
2. Go to Users tab
3. Find your own admin account
4. Try to delete
5. **Expected**: Error message "Cannot delete yourself"

## Cleanup After Testing

### Reset Test Data
```bash
php artisan migrate:fresh --seed
```

### Clear Caches
```bash
php artisan cache:clear
php artisan route:clear
php artisan config:clear
```

## Success Criteria

✅ All tabs load without errors
✅ All CRUD operations work (Create, Read, Update, Delete)
✅ CSV exports download successfully
✅ Role-based access control works (non-admins blocked)
✅ API responses are fast (< 1 second)
✅ Dark mode works across all tabs
✅ Search and filters function correctly
✅ No console errors in browser DevTools

## Next Steps After Successful Testing

1. **Production Security**:
   - Change default admin password
   - Enable HTTPS
   - Add rate limiting
   - Implement 2FA (future)

2. **Feature Enhancements**:
   - Add date range filters to reports
   - Implement bulk actions (approve multiple listings)
   - Add email notifications for admin actions
   - Create activity audit log

3. **Performance Optimization**:
   - Add pagination to tables
   - Implement infinite scroll
   - Cache statistics on backend
   - Optimize database queries with indexes

4. **User Experience**:
   - Add loading skeletons
   - Improve error messages
   - Add confirmation toasts
   - Implement undo functionality
