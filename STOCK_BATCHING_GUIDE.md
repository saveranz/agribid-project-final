# Dynamic Pricing & Stock Reflection System

## Overview
This system allows sellers to add multiple stock batches at different prices to the same listing. Each batch maintains its original price, and sales are processed using FIFO (First-In-First-Out) methodology.

## Example Scenario
- **Initial Stock**: 15 pcs @ ₱15.00/pc
- **New Stock Added**: 20 pcs @ ₱20.00/pc
- **Result**: The original 15 pcs remain at ₱15.00, new 20 pcs are at ₱20.00
- **When Selling**: Oldest batch (₱15.00) sells first

---

## Database Schema

### `stock_batches` Table
```sql
- id (bigint, primary key)
- listing_id (foreign key to listings)
- quantity (integer) - Original quantity in this batch
- remaining_quantity (integer) - Current remaining quantity
- price (decimal 10,2) - Price per unit for this batch
- batch_date (date) - Date when batch was added
- batch_number (string, nullable) - Optional reference number
- notes (text, nullable) - Optional batch notes
- status (enum: active, sold_out, expired)
- timestamps
```

---

## Backend Implementation

### Models

#### StockBatch Model
**Location**: `app/Models/StockBatch.php`

**Key Methods**:
- `hasStock()`: Check if batch has available stock
- `deduct($quantity)`: Deduct quantity from batch
- `scopeActive()`: Get active batches only
- `scopeOldestFirst()`: Order by FIFO

**Relationships**:
- `belongsTo(Listing::class)`

#### Listing Model Updates
**Location**: `app/Models/Listing.php`

**New Relationships**:
- `stockBatches()`: hasMany relationship
- `activeStockBatches()`: Active batches only

**New Attributes**:
- `total_available_quantity`: Sum of all active batch quantities
- `lowest_price`: Minimum price from active batches
- `highest_price`: Maximum price from active batches
- `batch_pricing`: All batches with prices (for buyer view)

**New Methods**:
- `deductStock($quantity)`: FIFO deduction across batches

---

## API Endpoints

### Stock Batch Management

#### 1. Get Stock Batches for a Listing
```
GET /api/v1/listings/{listingId}/stock-batches
Headers: Authorization: Bearer {token}
```

**Response**:
```json
{
  "status": "success",
  "message": "Stock batches retrieved successfully",
  "data": {
    "listing_id": 1,
    "listing_name": "Fresh Tomatoes",
    "total_quantity": 35,
    "price_range": {
      "lowest": 15.00,
      "highest": 20.00
    },
    "batches": [
      {
        "id": 1,
        "quantity": 15,
        "remaining_quantity": 10,
        "price": 15.00,
        "batch_date": "2025-01-15",
        "batch_number": "BATCH-001",
        "status": "active"
      },
      {
        "id": 2,
        "quantity": 20,
        "remaining_quantity": 20,
        "price": 20.00,
        "batch_date": "2025-01-20",
        "batch_number": "BATCH-002",
        "status": "active"
      }
    ]
  }
}
```

#### 2. Add New Stock Batch
```
POST /api/v1/listings/{listingId}/stock-batches
Headers: Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "quantity": 20,
  "price": 20.00,
  "batch_date": "2025-01-20",
  "batch_number": "BATCH-002",
  "notes": "Fresh harvest from north farm"
}
```

**Response**:
```json
{
  "status": "success",
  "message": "Stock batch added successfully",
  "data": {
    "batch": {
      "id": 2,
      "listing_id": 1,
      "quantity": 20,
      "remaining_quantity": 20,
      "price": 20.00,
      "batch_date": "2025-01-20",
      "status": "active"
    },
    "listing": {
      "id": 1,
      "name": "Fresh Tomatoes",
      "quantity": 35,
      "buy_now_price": 15.00
    }
  }
}
```

#### 3. Update Stock Batch
```
PUT /api/v1/listings/{listingId}/stock-batches/{batchId}
Headers: Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "price": 18.00,
  "notes": "Updated price due to market conditions"
}
```

#### 4. Delete Stock Batch
```
DELETE /api/v1/listings/{listingId}/stock-batches/{batchId}
Headers: Authorization: Bearer {token}
```

### Enhanced Listing Endpoints

#### Get Listing Details (with batch info)
```
GET /api/v1/listings/{id}
```

**Response includes**:
```json
{
  "data": {
    "id": 1,
    "name": "Fresh Tomatoes",
    "total_available": 35,
    "price_range": {
      "lowest": 15.00,
      "highest": 20.00
    },
    "batch_pricing": [
      {
        "id": 1,
        "remaining_quantity": 10,
        "price": 15.00,
        "batch_date": "2025-01-15"
      },
      {
        "id": 2,
        "remaining_quantity": 20,
        "price": 20.00,
        "batch_date": "2025-01-20"
      }
    ],
    "batch_count": 2
  }
}
```

---

## How FIFO Works

### Example Purchase Flow

**Initial State**:
- Batch 1: 10 pcs @ ₱15.00 (older)
- Batch 2: 20 pcs @ ₱20.00 (newer)

**Buyer purchases 15 pcs**:
1. System deducts from Batch 1 first (oldest): Takes all 10 pcs @ ₱15.00
2. Still needs 5 pcs, moves to Batch 2: Takes 5 pcs @ ₱20.00
3. Total cost: (10 × ₱15.00) + (5 × ₱20.00) = ₱250.00

**Final State**:
- Batch 1: 0 pcs @ ₱15.00 (status: sold_out)
- Batch 2: 15 pcs @ ₱20.00 (status: active)

### Code Implementation
```php
// In Listing model
public function deductStock(int $quantity): bool
{
    $remainingToDeduct = $quantity;
    $batches = $this->stockBatches()->active()->oldestFirst()->get();

    foreach ($batches as $batch) {
        if ($remainingToDeduct <= 0) break;
        
        $deductFromBatch = min($batch->remaining_quantity, $remainingToDeduct);
        $batch->deduct($deductFromBatch);
        $remainingToDeduct -= $deductFromBatch;
    }

    $this->quantity = $this->total_available_quantity;
    $this->save();

    return $remainingToDeduct === 0;
}
```

---

## Frontend Integration Guide

### Seller Dashboard - Add Stock Batch

```javascript
const addStockBatch = async (listingId, batchData) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/listings/${listingId}/stock-batches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quantity: batchData.quantity,
          price: batchData.price,
          batch_date: batchData.batchDate || new Date().toISOString().split('T')[0],
          batch_number: batchData.batchNumber,
          notes: batchData.notes
        })
      }
    );
    
    const result = await response.json();
    
    if (result.status === 'success') {
      console.log('Batch added:', result.data.batch);
      // Update UI to show new batch
    }
  } catch (error) {
    console.error('Error adding batch:', error);
  }
};
```

### Seller Dashboard - View Stock Batches

```javascript
const fetchStockBatches = async (listingId) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/listings/${listingId}/stock-batches`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    const result = await response.json();
    
    if (result.status === 'success') {
      return result.data;
      // Display batches in table format
    }
  } catch (error) {
    console.error('Error fetching batches:', error);
  }
};
```

### Buyer Dashboard - Display Price Range

```jsx
const ListingCard = ({ listing }) => {
  const hasPriceRange = listing.price_range.lowest !== listing.price_range.highest;
  
  return (
    <div className="listing-card">
      <h3>{listing.name}</h3>
      <p className="quantity">{listing.total_available} {listing.unit} available</p>
      
      {hasPriceRange ? (
        <div className="price-range">
          <span className="price-from">₱{listing.price_range.lowest.toFixed(2)}</span>
          <span className="price-separator"> - </span>
          <span className="price-to">₱{listing.price_range.highest.toFixed(2)}</span>
          <span className="price-note">per {listing.unit}</span>
        </div>
      ) : (
        <div className="single-price">
          ₱{listing.price_range.lowest.toFixed(2)} per {listing.unit}
        </div>
      )}
      
      {listing.batch_count > 1 && (
        <div className="batch-info">
          {listing.batch_count} price tiers available
        </div>
      )}
    </div>
  );
};
```

### Buyer Dashboard - Show Batch Details

```jsx
const BatchPricingModal = ({ batches }) => {
  return (
    <div className="batch-pricing-table">
      <h4>Available Stock by Price</h4>
      <table>
        <thead>
          <tr>
            <th>Quantity</th>
            <th>Price per Unit</th>
            <th>Batch Date</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.id}>
              <td>{batch.remaining_quantity} pcs</td>
              <td>₱{batch.price.toFixed(2)}</td>
              <td>{new Date(batch.batch_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="fifo-note">
        Note: Purchases will be fulfilled from oldest stock first
      </p>
    </div>
  );
};
```

---

## UI/UX Recommendations

### Seller Dashboard
1. **Stock Management Section**:
   - Display all active batches in a table
   - Show: Batch #, Quantity, Remaining, Price, Date, Status
   - "Add New Batch" button prominently placed

2. **Add Stock Batch Form**:
   ```
   - Quantity (required)
   - Price per unit (required)
   - Batch date (defaults to today)
   - Batch number (optional, auto-generated)
   - Notes (optional)
   ```

3. **Visual Indicators**:
   - Color-code batches by status (green: active, gray: sold out)
   - Show progress bar for each batch (remaining/total)
   - Highlight batches near depletion

### Buyer Dashboard
1. **Listing Cards**:
   - Show price range if multiple batches
   - Display "From ₱XX.XX" for lowest price
   - Badge: "Multiple prices available"

2. **Listing Detail Page**:
   - Expandable section: "View all pricing tiers"
   - Table showing batch quantities and prices
   - Clear explanation of FIFO selling

3. **Purchase Flow**:
   - Calculate total based on FIFO automatically
   - Show breakdown: "10 pcs @ ₱15 + 5 pcs @ ₱20 = ₱250"

---

## Testing Checklist

- [ ] Create listing without batches (legacy support)
- [ ] Add first batch to listing
- [ ] Add multiple batches at different prices
- [ ] View batch list in seller dashboard
- [ ] Update batch price/quantity
- [ ] Delete a batch
- [ ] Purchase from single batch
- [ ] Purchase spanning multiple batches (FIFO)
- [ ] Verify batch status changes to "sold_out" when empty
- [ ] Verify listing quantity updates after batch changes
- [ ] Check price_range calculation with 1 batch
- [ ] Check price_range calculation with multiple batches
- [ ] Verify lowest_price attribute
- [ ] Test batch ordering (oldest first)

---

## Migration & Deployment

### Step 1: Run Migration
```bash
php artisan migrate --path=database/migrations/2025_11_22_033206_create_stock_batches_table.php
```

### Step 2: Add Initial Batches (Optional)
For existing listings, you can create batches programmatically:

```php
use App\Models\Listing;
use App\Models\StockBatch;

// For each existing listing
Listing::where('listing_type', 'direct_buy')->each(function ($listing) {
    StockBatch::create([
        'listing_id' => $listing->id,
        'quantity' => $listing->quantity,
        'remaining_quantity' => $listing->quantity,
        'price' => $listing->buy_now_price,
        'batch_date' => $listing->created_at->toDateString(),
        'batch_number' => 'INITIAL-' . $listing->id,
        'status' => 'active',
    ]);
});
```

### Step 3: Update Frontend
1. Update listing components to display price_range
2. Add stock batch management to seller dashboard
3. Show batch details in buyer view
4. Update purchase logic to call FIFO deduction

---

## Future Enhancements

1. **Batch Expiration**:
   - Auto-expire batches based on date
   - Send alerts for expiring stock

2. **Price History**:
   - Track price changes over time
   - Display price trends to buyers

3. **Batch Analytics**:
   - Show which batches sell fastest
   - Report on price point performance

4. **Bulk Import**:
   - CSV upload for multiple batches
   - Excel template for batch entry

5. **Smart Pricing Suggestions**:
   - Recommend prices based on market trends
   - Alert sellers when prices deviate from average

---

## Support & Troubleshooting

### Common Issues

**Issue**: Batch not showing in listing
- **Solution**: Ensure batch status is 'active' and remaining_quantity > 0

**Issue**: Price range not updating
- **Solution**: Check that `lowest_price` and `highest_price` attributes are being calculated

**Issue**: FIFO not working correctly
- **Solution**: Verify batches are ordered by batch_date and created_at ascending

**Issue**: Quantity mismatch
- **Solution**: Run sync command to update listing quantity from batches:
  ```php
  $listing->quantity = $listing->total_available_quantity;
  $listing->save();
  ```

---

## Contact
For questions or issues, please contact the development team.
