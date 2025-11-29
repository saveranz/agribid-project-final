# AgriBid Admin Dashboard

A comprehensive admin control panel for the AgriBid agricultural e-commerce and bidding platform.

## Features

### 1. Dashboard Overview
- Real-time statistics and metrics
- Quick action buttons for common tasks
- Recent activity feed
- User, listing, transaction, and revenue summaries

### 2. User Management
- View all users (farmers and buyers)
- Approve/reject farmer verification
- Suspend, ban, or reinstate accounts
- Edit user details
- Reset user passwords
- Search and filter users

### 3. Listing Management
- Approve/reject new listings
- Flag, edit, or remove listings
- Review reported items
- View listing details with images
- Manage listings by category and type (Buy Now, Auction, Rental)

### 4. Transaction Management
- View all sales, auctions, and rentals
- Refund buyers
- Release payouts to sellers
- Force close auctions
- Approve/reject rental requests
- Apply penalties for late returns
- Export transaction logs

### 5. Dispute Resolution
- Review dispute evidence from both parties
- View message threads between users
- Issue or deny refunds
- Warn or ban users
- Close dispute cases
- Comprehensive evidence viewing

### 6. Reports & Analytics
- Revenue charts and trends
- Transaction type analysis
- Category distribution pie charts
- Top performing farmers
- Top buyers
- Activity summaries
- Export reports as PDF or Excel

### 7. Category Management
- Add, edit, and delete categories
- Manage subcategories
- View item counts per category
- Hierarchical category structure

### 8. Notifications Management
- Create announcements
- Send alerts to specific user groups
- Manage notification templates
- Schedule notifications
- Multi-channel delivery (in-app, email, SMS)
- Track notification views

### 9. System Settings
- Configure payment methods (GCash, Bank Transfer, Cash)
- Set platform fees for different transaction types
- General settings (site name, support contact, timezone)
- Auction settings (duration, bid increments, auto-extend)
- Rental settings (max days, penalties, deposits)
- Verification requirements
- Maintenance mode toggle
- Database backup and restore

### 10. Logs & Audit Trail
- Admin activity logs
- User login logs (successful and failed)
- System event logs
- Export logs by date range
- View critical events
- IP address tracking

## Technology Stack

- **React** - Frontend framework
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Charts and data visualization
- **Axios** - HTTP requests (ready for API integration)

## Installation

1. Install dependencies:
```bash
npm install recharts
```

2. The admin routes are already configured in `App.jsx`:
```
/admin/dashboard - Dashboard Overview
/admin/users - User Management
/admin/listings - Listing Management
/admin/transactions - Transaction Management
/admin/disputes - Dispute Resolution
/admin/reports - Reports & Analytics
/admin/categories - Category Management
/admin/notifications - Notifications
/admin/settings - System Settings
/admin/logs - Logs & Audit Trail
```

## Usage

Access the admin dashboard by navigating to `/admin` or `/admin/dashboard` in your browser.

### Navigation
- Sidebar navigation with icons
- Collapsible sidebar for more screen space
- Active route highlighting
- Logout button at the bottom

### Components

#### Shared Components (in `src/components/admin/`)
- `AdminLayout.jsx` - Main layout with sidebar and header
- `StatCard.jsx` - Reusable statistics card
- `DataTable.jsx` - Table with search, pagination, and actions
- `Modal.jsx` - Reusable modal dialog

#### Page Components (in `src/pages/admin/`)
- `DashboardOverview.jsx` - Main dashboard
- `UserManagement.jsx` - User administration
- `ListingManagement.jsx` - Listing control
- `TransactionManagement.jsx` - Transaction handling
- `DisputeResolution.jsx` - Dispute management
- `ReportsAnalytics.jsx` - Analytics and reports
- `CategoryManagement.jsx` - Category administration
- `NotificationsManagement.jsx` - Notification system
- `SystemSettings.jsx` - Platform configuration
- `LogsAuditTrail.jsx` - Activity monitoring

## API Integration

The dashboard is ready for backend integration. Key integration points:

1. **Authentication**: Add authentication checks in `AdminDashboard.jsx`
2. **API Calls**: Replace mock data with actual API calls using Axios
3. **Real-time Updates**: Add WebSocket support for live data
4. **File Uploads**: Implement file upload for images and documents

Example API integration:
```javascript
import axios from 'axios';

// Fetch users
const fetchUsers = async () => {
  const response = await axios.get('/api/admin/users');
  setUsers(response.data);
};

// Approve listing
const approveListing = async (listingId) => {
  await axios.post(`/api/admin/listings/${listingId}/approve`);
  // Refresh data
};
```

## Security Considerations

1. **Authentication**: Implement proper admin authentication
2. **Authorization**: Check admin permissions for sensitive actions
3. **CSRF Protection**: Add CSRF tokens to forms
4. **Rate Limiting**: Implement rate limiting on API endpoints
5. **Audit Logging**: All admin actions are logged
6. **Session Management**: Implement secure session handling

## Customization

### Colors
The dashboard uses a green color scheme. To change:
- Update Tailwind classes: `bg-green-600`, `text-green-700`, etc.
- Modify `AdminLayout.jsx` sidebar colors

### Features
To add new features:
1. Create a new page component in `src/pages/admin/`
2. Add route in `AdminDashboard.jsx`
3. Add menu item in `AdminLayout.jsx`

## Future Enhancements

- [ ] Real-time notifications with WebSocket
- [ ] Advanced filtering and sorting
- [ ] Bulk actions (bulk approve, bulk delete)
- [ ] Export to CSV/PDF
- [ ] Email template editor
- [ ] Advanced analytics dashboard
- [ ] Role-based access control (RBAC)
- [ ] Multi-language support
- [ ] Dark mode toggle

## Support

For issues or questions, contact the development team.

## License

Copyright © 2025 AgriBid. All rights reserved.
