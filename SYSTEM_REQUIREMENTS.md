# AgriBid System Requirements Specification

## 1. FUNCTIONAL REQUIREMENTS

| Requirement ID | Functional Requirements |
|---------------|------------------------|
| FR_001 | The system shall allow users to register with email, password, name, phone, and complete address. |
| FR_002 | The system shall allow users to log in using email and password credentials. |
| FR_003 | The system shall support three user roles: Farmer, Buyer, and Renter. |
| FR_004 | The system shall allow farmers to create product listings with name, category, type, quantity, price, location, and images. |
| FR_005 | The system shall allow farmers to create bidding posts with starting bid price. |
| FR_006 | The system shall allow farmers to set auction start and end dates for bidding posts. |
| FR_007 | The system shall allow buyers to place bids on auction listings. |
| FR_008 | The system shall validate that new bids are higher than the current highest bid. |
| FR_009 | The system shall provide bid confirmation popup before submission. |
| FR_010 | The system shall automatically declare the highest bidder once the auction expires. |
| FR_011 | The system shall display product location (Anilao, Bongabong, Oriental Mindoro) on listings. |
| FR_012 | The system shall allow farmers to post rental equipment with name, type, daily rate, and specifications. |
| FR_013 | The system shall allow buyers to rent farm tools/machinery by selecting start and end dates. |
| FR_014 | The system shall calculate rental costs based on number of days and daily rate. |
| FR_015 | The system shall support fixed-price marketplace listings (Direct Buy). |
| FR_016 | The system shall allow buyers to add Direct Buy products to cart and checkout. |
| FR_017 | The system shall support two delivery methods: Shipping and Pickup. |
| FR_018 | The system shall allow buyers to schedule pickup date, time, and location for pickup orders. |
| FR_019 | The system shall categorize products into: Crops, Livestock, Farm Inputs, Organic Produce, Seeds & Seedlings, Equipment, Tools & Machinery. |
| FR_020 | The system shall allow users to filter products by category and listing type. |
| FR_021 | The system shall allow users to search products by name, description, or category. |
| FR_022 | The system shall support multiple stock batches per listing with different harvest dates and prices. |
| FR_023 | The system shall allow buyers to select specific batches when purchasing. |
| FR_024 | The system shall automatically update stock quantities after orders. |
| FR_025 | The system shall track order status: Pending, Processing, Shipped, Delivered, Completed, Cancelled. |
| FR_026 | The system shall track order status for pickup: Pending, Processing, For Pickup, Completed. |
| FR_027 | The system shall allow sellers to update order status. |
| FR_028 | The system shall allow buyers to cancel orders before processing. |
| FR_029 | The system shall record payment information including method, amount, reference number, and proof image. |
| FR_030 | The system shall support payment methods: GCash, Bank Transfer, Cash on Delivery, Cash on Pickup. |
| FR_031 | The system shall allow sellers to verify and approve payments. |
| FR_032 | The system shall send notifications for new orders, bid updates, payment confirmations, and order status changes. |
| FR_033 | The system shall display unread notification count in header. |
| FR_034 | The system shall allow users to mark notifications as read. |
| FR_035 | The system shall allow buyers to add/remove listings to favorites. |
| FR_036 | The system shall allow buyers to rate and review completed transactions using 1-5 star scale. |
| FR_037 | The system shall display average ratings for products and sellers. |
| FR_038 | The system shall display flash deals with time-limited discounted prices. |
| FR_039 | The system shall show countdown timers for flash deals. |
| FR_040 | The system shall provide Farmer Dashboard showing revenue statistics, active listings, and recent orders. |
| FR_041 | The system shall provide Buyer Dashboard showing products by category, orders, and bidding activity. |
| FR_042 | The system shall calculate total revenue, pending payouts, and completed sales for farmers. |
| FR_043 | The system shall allow farmers to edit and delete their listings. |
| FR_044 | The system shall display bid history with bidder, amount, and timestamp. |
| FR_045 | The system shall support "Buy Now" option on auction items to purchase immediately. |
| FR_046 | The system shall paginate product listings with configurable items per page (20-200). |
| FR_047 | The system shall maintain user sessions using JWT tokens. |
| FR_048 | The system shall allow users to logout and invalidate their session. |
| FR_049 | The system shall support light and dark theme modes. |
| FR_050 | The system shall display product images from Unsplash URLs. |

**Table 1: Functional Requirements**

---

## 2. NON-FUNCTIONAL REQUIREMENTS

| Requirement ID | Non-Functional Requirements |
|---------------|----------------------------|
| NFR_001 | The system shall be accessible through modern web browsers (Chrome, Firefox, Safari, Edge) on desktop, laptop, and mobile devices. (Web access only; no mobile app required.) |
| NFR_002 | The system shall be fully responsive and adapt to different screen sizes when accessed through supported web browsers. |
| NFR_003 | The system shall have a user-friendly interface with intuitive navigation and consistent UI patterns. |
| NFR_004 | The system shall process user requests within 3 seconds on stable internet connection. |
| NFR_005 | The system shall load critical page content within 500 milliseconds. |
| NFR_006 | The system shall be deployable on cloud hosting environments and local servers. |
| NFR_007 | The system shall maintain data privacy and secure user accounts using encryption. |
| NFR_008 | The system shall encrypt user passwords using bcrypt hashing algorithm. |
| NFR_009 | The system shall protect against SQL injection through prepared statements and ORM. |
| NFR_010 | The system shall implement CORS policies to prevent unauthorized cross-origin access. |
| NFR_011 | The system shall require authentication using JWT tokens and Sanctum middleware for protected routes. |
| NFR_012 | The system shall store data reliably using MySQL database (version 8.0 or higher). |
| NFR_013 | The system shall implement ACID properties for database transactions. |
| NFR_014 | The system shall use foreign key constraints to enforce referential integrity. |
| NFR_015 | The system shall support at least 100 concurrent users without performance degradation. |
| NFR_016 | The system shall handle up to 10,000 product listings efficiently. |
| NFR_017 | The system shall cache API responses for 1-2 minutes to reduce database load. |
| NFR_018 | The system shall execute database queries within 100ms for 95% of requests. |
| NFR_019 | The system shall have 99% uptime during business hours. |
| NFR_020 | The system shall implement error handling with user-friendly error messages. |
| NFR_021 | The system shall provide immediate visual feedback for user actions (loading spinners, success messages). |
| NFR_022 | The system shall display form validation errors inline with specific field indicators. |
| NFR_023 | The system shall use lazy loading for images to optimize page load performance. |
| NFR_024 | The system shall optimize images with compression parameters (quality=60, auto format). |
| NFR_025 | The system shall follow PSR-12 coding standards for PHP backend code. |
| NFR_026 | The system shall use meaningful variable and function names throughout the codebase. |
| NFR_027 | The system shall implement database migrations that are reversible. |
| NFR_028 | The system shall follow consistent API response structure with success/error flags. |
| NFR_029 | The system shall display currency in Philippine Peso (₱) format. |
| NFR_030 | The system shall default locations to Anilao, Bongabong, Oriental Mindoro. |
| NFR_031 | The system shall log authentication attempts and critical errors for security monitoring. |
| NFR_032 | The system shall track API request performance metrics (response time, endpoint usage). |
| NFR_033 | The system shall comply with Data Privacy Act of 2012 (Philippines). |
| NFR_034 | The system shall be built using React 19 for frontend. |
| NFR_035 | The system shall be built using Laravel 12 and PHP 8.2+ for backend. |
| NFR_036 | The system shall use Tailwind CSS 4 for styling and responsive design. |
| NFR_037 | The system shall use Vite 7 as the frontend build tool. |
| NFR_038 | The system shall run backend on localhost:8000 during development. |
| NFR_039 | The system shall run frontend on localhost:5173 during development. |
| NFR_040 | The system shall implement priority-based loading (critical data first, secondary data in background). |

**Table 2: Non-Functional Requirements**

**Table 2: Non-Functional Requirements**

---

## 3. REQUIREMENTS SUMMARY

### Implementation Status
- **Total Functional Requirements**: 50
- **Implemented**: 50 (100%)
- **Total Non-Functional Requirements**: 40
- **Implemented**: 40 (100%)

### Technology Stack
- **Frontend**: React 19, Vite 7, Tailwind CSS 4, Lucide React Icons
- **Backend**: Laravel 12, PHP 8.2+
- **Database**: MySQL 8.0+
- **Authentication**: JWT Tokens, Laravel Sanctum
- **Development Environment**: Laragon (Windows)
- **Image Hosting**: Unsplash URLs

### Target Users
- **Primary**: Farmers, Buyers, Equipment Renters
- **Location**: Anilao, Bongabong, Oriental Mindoro, Philippines
- **Access**: Web browsers (desktop, laptop, mobile)

### Key Features
1. User registration and authentication (3 roles)
2. Product marketplace with 7 categories
3. Auction bidding system with time limits
4. Direct buy fixed-price listings
5. Equipment rental system
6. Stock batch management
7. Order tracking and management
8. Payment processing (multiple methods)
9. Notifications system
10. Reviews and ratings
11. Favorites/wishlist
12. Search and filtering
13. Real-time dashboards
14. Responsive design with dark mode

---

**Document Version**: 1.0  
**Last Updated**: December 2, 2025  
**Status**: Production Ready  
**Compliance**: Data Privacy Act of 2012 (Philippines)
