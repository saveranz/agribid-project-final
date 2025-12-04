<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Listing;
use App\Models\Bid;
use App\Models\Order;
use App\Models\Equipment;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    use ApiResponses;

    /**
     * Get all users for admin management
     */
    public function getUsers(Request $request)
    {
        $query = User::select([
            'id', 'name', 'email', 'role', 'phone', 
            'street_address', 'barangay', 'city', 'province',
            'created_at', 'updated_at'
        ]);

        // Filter by role if specified
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return $this->success($users, 'Users retrieved successfully');
    }

    /**
     * Get system statistics
     */
    public function getStatistics()
    {
        $stats = [
            'users' => [
                'total' => User::count(),
                'farmers' => User::where('role', 'farmer')->count(),
                'buyers' => User::where('role', 'buyer')->count(),
                'renters' => User::where('role', 'renter')->count(),
            ],
            'listings' => [
                'total' => Listing::count(),
                'active' => Listing::where('status', 'active')->count(),
                'pending' => Listing::where('approval_status', 'pending')->count(),
                'approved' => Listing::where('approval_status', 'approved')->count(),
                'rejected' => Listing::where('approval_status', 'rejected')->count(),
            ],
            'bids' => [
                'total' => Bid::count(),
                'active' => Bid::where('status', 'active')->count(),
                'winning' => Bid::where('status', 'winning')->count(),
            ],
            'equipment' => [
                'total' => Equipment::count(),
                'available' => Equipment::where('availability_status', 'available')->count(),
                'rented' => Equipment::where('availability_status', 'rented')->count(),
            ],
            'orders' => [
                'total' => Order::count(),
                'pending' => Order::where('status', 'pending')->count(),
                'processing' => Order::where('status', 'processing')->count(),
                'completed' => Order::where('status', 'completed')->count(),
            ],
            'revenue' => [
                'total' => Order::where('status', 'completed')->sum('total_amount'),
                'monthly' => Order::where('status', 'completed')
                    ->whereMonth('created_at', now()->month)
                    ->sum('total_amount'),
            ]
        ];

        return $this->success($stats, 'Statistics retrieved successfully');
    }

    /**
     * Approve listing
     */
    public function approveListing(Request $request, $id)
    {
        $listing = Listing::findOrFail($id);
        $listing->approval_status = 'approved';
        $listing->save();

        return $this->success($listing, 'Listing approved successfully');
    }

    /**
     * Reject listing
     */
    public function rejectListing(Request $request, $id)
    {
        $request->validate([
            'reason' => 'nullable|string|max:500'
        ]);

        $listing = Listing::findOrFail($id);
        $listing->approval_status = 'rejected';
        $listing->rejection_reason = $request->reason;
        $listing->save();

        return $this->success($listing, 'Listing rejected successfully');
    }

    /**
     * Delete user (soft delete)
     */
    public function deleteUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $currentUser = $request->user();
        
        // Prevent deleting yourself
        if ($currentUser && $user->id == $currentUser->id) {
            return $this->error('Cannot delete your own account', 400);
        }

        $user->delete();

        return $this->success(null, 'User deleted successfully');
    }

    /**
     * Delete listing
     */
    public function deleteListing($id)
    {
        $listing = Listing::findOrFail($id);
        $listing->delete();

        return $this->success(null, 'Listing deleted successfully');
    }

    /**
     * Get activity logs
     */
    public function getActivityLogs(Request $request)
    {
        $logs = [];

        // Recent listings
        $recentListings = Listing::with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($listing) {
                return [
                    'type' => 'listing',
                    'action' => 'created',
                    'user' => $listing->user->name,
                    'item' => $listing->name,
                    'status' => $listing->approval_status,
                    'timestamp' => $listing->created_at,
                ];
            });

        // Recent bids
        $recentBids = Bid::with(['buyer', 'listing'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($bid) {
                return [
                    'type' => 'bid',
                    'action' => 'placed',
                    'user' => $bid->buyer->name,
                    'item' => $bid->listing->name,
                    'amount' => $bid->bid_amount,
                    'timestamp' => $bid->created_at,
                ];
            });

        // Recent orders
        $recentOrders = Order::with(['buyer', 'listing'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function($order) {
                return [
                    'type' => 'order',
                    'action' => 'placed',
                    'user' => $order->buyer->name,
                    'item' => $order->listing->name,
                    'amount' => $order->total_amount,
                    'timestamp' => $order->created_at,
                ];
            });

        // Merge and sort all activities
        $logs = collect($recentListings)
            ->concat($recentBids)
            ->concat($recentOrders)
            ->sortByDesc('timestamp')
            ->take(20)
            ->values();

        return $this->success($logs, 'Activity logs retrieved successfully');
    }

    /**
     * Generate reports
     */
    public function generateReport(Request $request)
    {
        $type = $request->input('type', 'users');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $data = [];

        switch ($type) {
            case 'users':
                $query = User::query();
                if ($startDate) $query->where('created_at', '>=', $startDate);
                if ($endDate) $query->where('created_at', '<=', $endDate);
                $data = $query->get();
                break;

            case 'listings':
                $query = Listing::with(['user', 'category']);
                if ($startDate) $query->where('created_at', '>=', $startDate);
                if ($endDate) $query->where('created_at', '<=', $endDate);
                $data = $query->get();
                break;

            case 'bids':
                $query = Bid::with(['buyer', 'listing']);
                if ($startDate) $query->where('created_at', '>=', $startDate);
                if ($endDate) $query->where('created_at', '<=', $endDate);
                $data = $query->get();
                break;

            case 'equipment':
                $query = Equipment::with('owner');
                $data = $query->get();
                break;

            case 'orders':
                $query = Order::with(['buyer', 'listing']);
                if ($startDate) $query->where('created_at', '>=', $startDate);
                if ($endDate) $query->where('created_at', '<=', $endDate);
                $data = $query->get();
                break;
        }

        return $this->success($data, 'Report data generated successfully');
    }
}
