<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ListingController;
use App\Http\Controllers\Api\V1\BidController;
use App\Http\Controllers\Api\V1\EquipmentController;
use App\Http\Controllers\Api\V1\TransactionController;
use App\Http\Controllers\Api\V1\FavoriteController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\StockBatchController;
use App\Http\Controllers\Api\V1\BuyerFeedbackController;
use App\Http\Controllers\Api\V1\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Private(Authenticated) Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', function (Request $request) {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'street_address' => 'nullable|string',
            'barangay' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:10',
        ]);

        $request->user()->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $request->user()
        ]);
    });

    // Listings
    Route::apiResource('listings', ListingController::class);
    Route::get('/flash-deals', [ListingController::class, 'flashDeals']);
    Route::get('/auctions', [ListingController::class, 'auctionListings']);
    Route::get('/direct-buy', [ListingController::class, 'directBuyListings']);
    Route::get('/listings-archived', [ListingController::class, 'archived']);
    Route::post('/listings/{id}/restore', [ListingController::class, 'restore']);

    // Stock Batches
    Route::get('/listings/{listing}/stock-batches', [StockBatchController::class, 'index']);
    Route::post('/listings/{listing}/stock-batches', [StockBatchController::class, 'store']);
    Route::put('/listings/{listing}/stock-batches/{batch}', [StockBatchController::class, 'update']);
    Route::delete('/listings/{listing}/stock-batches/{batch}', [StockBatchController::class, 'destroy']);

    // Bidding
    Route::apiResource('bids', BidController::class);
    Route::get('/listings/{id}/bidders', [BidController::class, 'getBidders']);

    // Equipment Rentals
    Route::apiResource('equipment', EquipmentController::class);
    Route::post('/equipment/{id}/rent', [EquipmentController::class, 'rent']);
    Route::get('/my-rentals', [EquipmentController::class, 'myRentals']);

    // Transactions / Orders
    Route::apiResource('transactions', TransactionController::class);
    Route::get('/my-orders', [TransactionController::class, 'index']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{id}', [FavoriteController::class, 'destroy']);
    Route::get('/favorites/check/{listingId}', [FavoriteController::class, 'check']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Buyer Feedback
    Route::get('/buyer-feedback', [BuyerFeedbackController::class, 'index']);
    Route::get('/buyer-feedback/my-given', [BuyerFeedbackController::class, 'myGivenFeedback']);
    Route::get('/buyer-feedback/my-received', [BuyerFeedbackController::class, 'myReceivedFeedback']);
    Route::get('/buyer-feedback/buyer/{buyer}', [BuyerFeedbackController::class, 'getBuyerRating']);
    Route::get('/buyer-feedback/eligible-buyers', [BuyerFeedbackController::class, 'getEligibleBuyers']);
    Route::post('/buyer-feedback', [BuyerFeedbackController::class, 'store']);
    Route::put('/buyer-feedback/{feedback}', [BuyerFeedbackController::class, 'update']);
    Route::post('/buyer-feedback/{feedback}/respond', [BuyerFeedbackController::class, 'respond']);
    Route::delete('/buyer-feedback/{feedback}', [BuyerFeedbackController::class, 'destroy']);

    // Orders (Direct Buy)
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/seller', [OrderController::class, 'sellerOrders']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);
});

//Public Routes
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register'])->name('register');

// Categories (public)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
