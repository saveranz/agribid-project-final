# Auction Payment Transparency & Partial Payment Tracking

## Feature Overview

This feature provides complete visibility and tracking of payments for auction transactions, ensuring trust and transparency between farmers (sellers) and buyers throughout the payment process.

## Database Schema

### auction_payments Table
Tracks individual payment transactions:
- **bid_id**: Reference to the winning bid
- **buyer_id**: The buyer making the payment
- **seller_id**: The farmer receiving the payment
- **listing_id**: The auctioned product
- **amount**: Payment amount
- **payment_type**: downpayment | partial | final | full
- **payment_method**: cod | agribidpay | gcash | bank_transfer | cash
- **payment_reference**: Transaction ID or reference number
- **payment_proof**: File path for payment proof upload
- **status**: pending | verified | rejected
- **notes**: Additional payment notes
- **rejection_reason**: Reason if payment rejected
- **payment_date**: When payment was made
- **verified_at**: When payment was verified
- **verified_by**: Admin/seller who verified

### Extended bids Table Fields
Payment tracking added to bids:
- **winning_bid_amount**: Final auction price
- **total_paid**: Sum of verified payments
- **remaining_balance**: Amount still owed
- **minimum_downpayment**: Required initial payment
- **payment_status**: unpaid | partial | paid | overdue
- **payment_deadline**: Due date for payment
- **full_payment_date**: When fully paid
- **fulfillment_status**: pending | ready_for_pickup | in_transit | delivered | completed

## API Endpoints

### Payment Management

```http
POST /api/v1/auction-payments
```
Submit a payment for winning bid
**Body:**
```json
{
  "bid_id": 1,
  "amount": 2000,
  "payment_type": "downpayment",
  "payment_method": "gcash",
  "payment_reference": "GCASH123456",
  "payment_proof": "<file>",
  "notes": "Initial payment for mangoes"
}
```

```http
GET /api/v1/auction-payments/bid/{bidId}
```
Get all payments for a specific bid with full history

```http
GET /api/v1/auction-payments/buyer
```
Get buyer's payment history across all auctions

```http
GET /api/v1/auction-payments/seller
```
Get seller's received payments and pending verifications

```http
PUT /api/v1/auction-payments/{id}/verify
```
Seller/admin verifies a payment
**Body:**
```json
{
  "status": "verified",
  "notes": "Payment confirmed"
}
```

```http
GET /api/v1/bids/{bidId}/payment-status
```
Get complete payment transparency card data

## Payment Flow

### 1. Buyer Wins Auction
- System sets `is_winning = true` on bid
- Creates payment tracking:
  - `winning_bid_amount = final_bid`
  - `minimum_downpayment = 20%` (configurable)
  - `payment_deadline = +3 days`
  - `payment_status = 'unpaid'`
- Buyer receives notification with payment options

### 2. Buyer Submits Payment
- Uploads payment proof
- Enters reference number
- Selects payment method
- Creates `AuctionPayment` record with `status='pending'`
- Seller receives notification to verify

### 3. Seller Verifies Payment
- Reviews payment proof
- Confirms amount received
- Updates payment `status='verified'`
- System automatically:
  - Updates `total_paid`
  - Calculates `remaining_balance`
  - Updates `payment_status` (partial/paid)
  - Sends confirmation to buyer

### 4. Payment Completion
- When `remaining_balance = 0`:
  - `payment_status = 'paid'`
  - `full_payment_date = now()`
  - `fulfillment_status = 'ready_for_pickup'`
- Notifications sent to both parties

## Frontend Components

### Buyer Dashboard - Payment Status Card

Located in: `BuyerDashboard.jsx`

**Display Elements:**
```jsx
<PaymentTransparencyCard>
  <WinningBidPrice>₱15,000</WinningBidPrice>
  <DownpaymentPaid>₱2,000</DownpaymentPaid>
  <RemainingBalance>₱13,000</RemainingBalance>
  <PaymentDeadline>Jan 23, 2025</PaymentDeadline>
  <PaymentStatus>Partially Paid</PaymentStatus>
  <PaymentHistory>
    - ₱2,000 (GCash) - Nov 20, 2024 ✓ Verified
  </PaymentHistory>
  <MakePaymentButton />
</PaymentTransparencyCard>
```

**Features:**
- Real-time balance calculation
- Payment history timeline
- Upload payment proof
- Payment method selection
- Deadline countdown
- Status badges with colors

### Farmer Dashboard - Auction Sales Overview

Located in: `FarmerDashboard.jsx`

**Display Elements:**
```jsx
<AuctionSaleCard>
  <BuyerInfo>John Doe</BuyerInfo>
  <ProductName>Fresh Mangoes</ProductName>
  <WinningBid>₱15,000</WinningBid>
  <PaymentReceived>₱2,000</PaymentReceived>
  <PendingBalance>₱13,000</PendingBalance>
  <PaymentDeadline>Jan 23, 2025</PaymentDeadline>
  <FulfillmentStatus>Pending Full Payment</FulfillmentStatus>
  <VerifyPaymentButton />
  <PaymentHistory />
</AuctionSaleCard>
```

**Features:**
- Pending payment verifications list
- One-click verification
- View payment proofs
- Payment timeline
- Ready-for-pickup status
- Contact buyer button

## Payment Status States

### unpaid
- No payments received
- Show deadline
- Enable payment button
- Color: Red

### partial
- Some payment received
- Show remaining balance
- Show payment history
- Enable additional payment
- Color: Orange

### paid
- Full amount received
- Show completion date
- Enable fulfillment actions
- Color: Green

### overdue
- Past payment deadline
- Highlight urgency
- Send reminders
- Enable late payment
- Color: Dark Red

## Fulfillment Status States

### pending
Waiting for full payment

### ready_for_pickup
Payment complete, ready to collect

### in_transit
Being delivered to buyer

### delivered
Buyer received product

### completed
Transaction fully completed and rated

## Security Features

1. **Payment Verification**
   - Seller must verify each payment
   - Admin can override verification
   - Payment proof required for online methods

2. **Transaction Logging**
   - All payments timestamped
   - Verifier recorded
   - Immutable history

3. **Access Control**
   - Buyers see only their payments
   - Sellers see only their auctions
   - Admin has full visibility

4. **Fraud Prevention**
   - Payment proof validation
   - Reference number checking
   - Duplicate payment prevention

## Notifications

### Buyer Notifications
- Auction won - payment required
- Payment deadline reminder (24h before)
- Payment verified confirmation
- Payment overdue warning
- Product ready for pickup

### Seller Notifications
- New payment received - verify required
- Payment deadline approaching
- Payment overdue - buyer reminder sent
- Full payment received
- Ready for fulfillment

## Configuration

### Payment Settings (Admin)
```php
// config/auction.php
return [
    'minimum_downpayment_percent' => 20, // 20% minimum
    'payment_deadline_days' => 3, // 3 days to pay
    'late_payment_grace_days' => 2, // 2 days grace period
    'enable_partial_payments' => true,
    'allowed_payment_methods' => ['cod', 'gcash', 'bank_transfer'],
];
```

## Benefits

### For Buyers
✅ Clear payment breakdown
✅ Flexible payment options
✅ Payment history tracking
✅ Proof of payment storage
✅ Deadline visibility

### For Farmers
✅ Payment transparency
✅ Easy verification process
✅ Track outstanding balances
✅ Automated status updates
✅ Secure payment proofs

### For Platform
✅ Trust building
✅ Dispute resolution
✅ Transaction auditing
✅ Automated workflows
✅ Reduced support tickets

## Implementation Status

✅ **Database**: Migrations completed
✅ **Models**: AuctionPayment & Bid updated
✅ **Backend**: Controller & API ready
⏳ **Frontend**: Components pending
⏳ **Testing**: Integration tests pending
⏳ **Documentation**: User guides pending

## Next Steps

1. Create frontend payment components
2. Implement payment upload functionality
3. Add notification system integration
4. Create admin verification interface
5. Add payment reminder scheduler
6. Implement overdue payment handling
7. Create payment reports for analytics
8. Add automated refund system (if needed)

## Testing Scenarios

1. **Happy Path**: Downpayment → Partial → Final Payment
2. **Full Payment**: Single payment for full amount
3. **Late Payment**: Payment after deadline
4. **Rejected Payment**: Seller rejects invalid proof
5. **Multiple Partials**: Several small payments
6. **Overdue Recovery**: Payment after overdue status
