# Shopee-like Checkout System Implementation

## Overview
Implemented a complete e-commerce checkout flow for direct buying listings, similar to Shopee's user experience. The system differentiates between auction (bidding) and direct buy listings, providing appropriate interfaces for each.

## Key Changes

### 1. Removed Per-Unit Pricing from Auction Listings
**Files Modified:**
- `frontend-react/src/pages/BuyerDashboard.jsx` (line 788)
- `frontend-react/src/pages/FarmerDashboard.jsx` (line 1095)

**Reason:** For auction listings (trees/standing crops), buyers purchase the entire lot, not by weight. Per-unit pricing was misleading.

**Changes:**
- Removed `₱X/kg` display from product cards
- Removed per-unit calculation from farmer dashboard listings table
- Only showing total quantity and starting/current bid

### 2. Unit Selection Modal for Direct Buy
**File:** `frontend-react/src/pages/BuyerDashboard.jsx`

**Features:**
- Product image and details display
- Quantity selector with +/- buttons
- Real-time price calculation
- Stock availability validation
- Clean, mobile-friendly UI

**State Variables:**
```javascript
const [showUnitSelectionModal, setShowUnitSelectionModal] = useState(false);
const [selectedUnit, setSelectedUnit] = useState("kg");
const [orderQuantity, setOrderQuantity] = useState(1);
```

**Modal Triggers:**
- "Buy Now" button appears for `listing_type === "direct_buy"`
- "Place Bid" button appears for `listing_type === "auction"`

### 3. Checkout Page Component
**File:** `frontend-react/src/pages/Checkout.jsx`

**UI Structure (following Shopee):**
1. **Delivery Address Section**
   - Display user's saved address
   - Phone number
   - Change address option

2. **Product Details Section**
   - Seller name
   - Product image and name
   - Unit type
   - Price per unit × quantity
   - Shop voucher option
   - Message for seller input
   - E-receipt request

3. **Shipping Option**
   - Standard local delivery
   - Estimated delivery dates (3-7 days)
   - Free shipping promotion display
   - Shipping fee with discount

4. **Payment Methods**
   - Cash on Delivery (COD) - default
   - AgribidPay
   - PayLater with installment options
   - Visual selection with checkmarks

5. **Payment Details Summary**
   - Merchandise subtotal
   - Shipping subtotal
   - Shipping discount
   - **Total Payment** (highlighted)

6. **Bottom Action Bar**
   - Total amount display
   - Savings display
   - "Place Order" button

### 4. Routing Updates
**File:** `frontend-react/src/App.jsx`

**Changes:**
- Imported `Checkout` component
- Added `/checkout` route with buyer-only protection
- Added `/checkout` to `hiddenNavbarRoutes` array

```javascript
<Route 
  path="/checkout" 
  element={
    <ProtectedRoute allowedRoles={['buyer']}>
      <Checkout />
    </ProtectedRoute>
  } 
/>
```

### 5. Database Schema - Orders Table
**File:** `backend-laravel/database/migrations/2025_11_23_005641_create_orders_table.php`

**Schema:**
```sql
- id (primary key)
- buyer_id (foreign key to users)
- seller_id (foreign key to users)
- listing_id (foreign key to listings)
- quantity, unit, price_per_unit
- subtotal, shipping_fee, discount, total_amount
- delivery_name, delivery_phone, delivery_street_address, 
  delivery_barangay, delivery_city, delivery_province, delivery_postal_code
- payment_method (enum: cod, agribidpay, gcash, paylater)
- shipping_option
- estimated_delivery_start, estimated_delivery_end
- status (enum: pending, confirmed, processing, shipped, delivered, cancelled, refunded)
- message_for_seller, voucher_code
- confirmed_at, shipped_at, delivered_at, cancelled_at
- cancellation_reason
- timestamps
```

**Indexes:**
- buyer_id, seller_id, listing_id, status

### 6. Order Model
**File:** `backend-laravel/app/Models/Order.php`

**Relationships:**
- `buyer()` - BelongsTo User
- `seller()` - BelongsTo User
- `listing()` - BelongsTo Listing

**Casts:**
- Decimal fields: price_per_unit, subtotal, shipping_fee, discount, total_amount
- Date fields: estimated_delivery_start/end
- Datetime fields: confirmed_at, shipped_at, delivered_at, cancelled_at

### 7. Order API Endpoints
**File:** `backend-laravel/app/Http/Controllers/Api/V1/OrderController.php`

**Endpoints:**
1. `GET /api/v1/orders` - Get buyer's orders
2. `GET /api/v1/orders/seller` - Get seller's orders
3. `GET /api/v1/orders/{id}` - Get single order details
4. `POST /api/v1/orders` - Create new order
5. `PUT /api/v1/orders/{id}/status` - Update order status
6. `POST /api/v1/orders/{id}/cancel` - Cancel order (buyer only)

**Business Logic:**
- Validates stock availability before order creation
- Automatically calculates pricing (per-unit × quantity)
- Applies shipping fee and discounts
- Updates listing quantity when order placed
- Restores quantity when order cancelled
- Tracks timestamps for each status change
- Only allows buyer to cancel pending/confirmed orders

**Routes:** `backend-laravel/routes/api_v1.php`

### 8. Frontend Data Flow

**transformListings() Updates:**
```javascript
listingType: listing.listing_type || "auction",
rawQuantity: parseFloat(listing.quantity),
pricePerUnit: listing.buy_now_price ? parseFloat(listing.buy_now_price) / parseFloat(listing.quantity) : 0,
```

**Checkout Navigation:**
```javascript
navigate('/checkout', {
  state: {
    item: selectedItem,
    quantity: orderQuantity,
    unit: selectedUnit,
    subtotal: selectedItem.pricePerUnit * orderQuantity
  }
});
```

**Order Creation API Call:**
```javascript
await fetch('http://localhost:8000/api/v1/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    listing_id, quantity, unit,
    payment_method, message_for_seller, voucher_code
  })
});
```

## User Flow

### Direct Buy Flow:
1. Buyer browses products in dashboard
2. Clicks "Buy Now" on direct_buy listing
3. Unit selection modal opens
4. Selects quantity (validated against stock)
5. Reviews order summary in modal
6. Clicks "Buy Now" → navigates to checkout
7. Reviews delivery address, shipping, payment
8. Selects payment method
9. Clicks "Place Order"
10. Order created, listing stock decremented
11. Redirected to buyer dashboard

### Auction Flow (unchanged):
1. Buyer browses auction listings
2. Clicks "Place Bid"
3. Bid modal opens
4. Enters bid amount
5. Submits bid

## Testing Checklist

- [ ] Direct buy listings show "Buy Now" button
- [ ] Auction listings show "Place Bid" button
- [ ] Unit selection modal opens with correct product data
- [ ] Quantity validation prevents exceeding stock
- [ ] Price calculation updates in real-time
- [ ] Checkout page loads with correct order data
- [ ] Delivery address displays correctly
- [ ] Payment method selection works
- [ ] Order API creates order successfully
- [ ] Listing quantity decrements after order
- [ ] Order appears in buyer's order history
- [ ] Order appears in seller's incoming orders
- [ ] Order cancellation restores stock

## Future Enhancements

1. **Voucher System**
   - Voucher code validation
   - Automatic discount application
   - Shop vouchers vs platform vouchers

2. **Order Tracking**
   - Real-time status updates
   - Delivery tracking number
   - Estimated delivery countdown

3. **Payment Integration**
   - AgribidPay wallet system
   - GCash/Maya integration
   - PayLater credit approval

4. **Notifications**
   - Order confirmation email/SMS
   - Status update notifications
   - Delivery reminders

5. **Reviews & Ratings**
   - Product reviews after delivery
   - Seller ratings
   - Photo reviews

6. **Batch Order Support**
   - FIFO stock batch selection
   - Variable pricing per batch
   - Mixed batch orders

## Files Modified Summary

### Frontend:
- `frontend-react/src/pages/BuyerDashboard.jsx` - Added unit selection modal, updated button logic
- `frontend-react/src/pages/Checkout.jsx` - NEW - Complete checkout page
- `frontend-react/src/pages/FarmerDashboard.jsx` - Removed per-unit pricing
- `frontend-react/src/App.jsx` - Added checkout route

### Backend:
- `backend-laravel/database/migrations/2025_11_23_005641_create_orders_table.php` - NEW
- `backend-laravel/app/Models/Order.php` - NEW
- `backend-laravel/app/Http/Controllers/Api/V1/OrderController.php` - NEW
- `backend-laravel/routes/api_v1.php` - Added order routes

## Database Changes
```bash
php artisan migrate
```
New table: `orders` with 40+ columns tracking complete order lifecycle.
