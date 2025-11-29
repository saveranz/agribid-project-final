# Stock Batch Management System

## Overview
The Stock Batch Management system allows farmers to manage Direct Buy products with multiple batches at different prices and harvest dates. This is essential for agricultural products that are harvested and sold in batches over time.

## How It Works

### 1. **Backend Implementation**

#### Models
- **StockBatch Model** (`app/Models/StockBatch.php`)
  - Tracks individual batches with:
    - `quantity` - Original batch quantity
    - `remaining_quantity` - Current available stock
    - `price` - Price per unit for this batch
    - `batch_date` - Harvest/production date
    - `batch_number` - Optional reference number
    - `status` - active, sold_out, expired

#### Key Features

**FIFO (First-In-First-Out) Method**
- When orders are placed, stock is deducted from the **oldest batch first**
- This ensures older produce is sold before newer harvest
- Implemented in `Listing::deductStock()` method

**Automatic Price Calculation**
- `lowest_price` - Automatically calculated from active batches
- `highest_price` - Shows price range to buyers
- `buy_now_price` - Always shows the lowest available price

**Dynamic Quantity Tracking**
- `total_available_quantity` - Sum of all active batch quantities
- Main listing `quantity` field syncs automatically
- Individual batch `remaining_quantity` updates on each sale

### 2. **API Endpoints**

#### Stock Batch Management
```
GET    /api/v1/listings/{id}/stock-batches       - View all batches
POST   /api/v1/listings/{id}/stock-batches       - Add new batch
PUT    /api/v1/listings/{id}/stock-batches/{id}  - Update batch
DELETE /api/v1/listings/{id}/stock-batches/{id}  - Delete batch
```

#### Order Integration
When a buyer places an order:
1. System checks if listing uses batch management
2. If yes: Deducts using FIFO method across batches
3. If no: Deducts from main quantity
4. Updates batch status to 'sold_out' when `remaining_quantity` = 0

### 3. **Frontend Integration**

#### Farmer Dashboard
- **Stock Management Modal** - View and manage all batches
- **Add Batch Form** - Add new harvests with quantity and price
- **Batch List** - Shows all batches with:
  - Remaining quantity
  - Price per unit
  - Batch date
  - Status indicator
  - Delete option

#### Buyer View
- **Price Range Display** - Shows "₱X - ₱Y per kg"
- **Quantity-Based Pricing** - Calculates total from multiple batches
- **Stock Availability** - Shows total available across all batches

### 4. **Business Benefits**

✅ **Flexible Pricing**
- Set different prices for different harvest dates
- Offer competitive pricing on older stock
- Premium pricing on fresh harvest

✅ **Inventory Control**
- Track exactly which harvest is being sold
- Prevent selling out-of-season produce
- Manage expiry dates effectively

✅ **Transparency**
- Buyers see price ranges upfront
- Clear indication of batch availability
- Fair pricing based on harvest date

✅ **Automatic Management**
- FIFO ensures oldest stock sells first
- No manual calculation needed
- Real-time stock updates

### 5. **Usage Example**

**Scenario:** Farmer harvests mangoes in 3 batches

```
Batch 1: Nov 1  - 50kg @ ₱80/kg  (Older - Lower price)
Batch 2: Nov 15 - 75kg @ ₱100/kg (Mid)
Batch 3: Nov 28 - 100kg @ ₱120/kg (Fresh - Premium)
```

**Display to Buyer:**
- Total Available: 225kg
- Price Range: ₱80 - ₱120 per kg
- Buy Now Price: ₱80/kg (lowest)

**When Buyer Orders 60kg:**
1. Deduct 50kg from Batch 1 (oldest) - **Batch 1: SOLD OUT**
2. Deduct 10kg from Batch 2 - **Batch 2: 65kg remaining**
3. Batch 3 untouched - **Batch 3: 100kg remaining**

**Updated Display:**
- Total Available: 165kg
- Price Range: ₱100 - ₱120 per kg
- Buy Now Price: ₱100/kg (new lowest)

### 6. **Integration Points**

#### When Adding Stock Batch
```php
POST /api/v1/listings/{id}/stock-batches
- Creates new batch
- Updates listing total quantity
- Recalculates lowest/highest prices
```

#### When Order is Placed
```php
POST /api/v1/orders
- Checks batch availability
- Deducts using FIFO method
- Updates all affected batches
- Syncs main listing quantity
```

#### When Viewing Listing
```php
GET /api/v1/listings/{id}
- Returns total_available_quantity
- Returns price_range (lowest, highest)
- Returns batch_pricing array
```

### 7. **Database Schema**

```sql
stock_batches
- id
- listing_id (foreign key)
- quantity (original)
- remaining_quantity (current)
- price (decimal)
- batch_date (date)
- batch_number (nullable)
- notes (nullable)
- status (enum: active, sold_out, expired)
- created_at
- updated_at
```

### 8. **Best Practices**

**For Farmers:**
- Add batches immediately after harvest
- Set competitive prices for older batches
- Use batch_number for tracking
- Monitor remaining quantities
- Delete expired batches

**For System:**
- Always use FIFO for deduction
- Keep batch status updated
- Sync main listing quantity
- Validate before deduction
- Use transactions for consistency

## Current Status

✅ **Implemented:**
- Stock batch CRUD operations
- FIFO deduction method
- Automatic price calculation
- Order integration
- Frontend UI for management

✅ **Tested:**
- Multiple batch creation
- FIFO deduction logic
- Price range calculation
- Quantity synchronization

## Future Enhancements

🔄 **Potential Improvements:**
- Batch expiry notifications
- Automatic price adjustments
- Batch analytics/reports
- QR code per batch
- Temperature/storage tracking
- Batch quality ratings
