<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Equipment;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class EquipmentController extends Controller
{
    use ApiResponses;

    /**
     * Display a listing of available equipment.
     */
    public function index(Request $request)
    {
        $query = Equipment::with(['owner'])->available();

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $equipment = $query->paginate(12);

        // Transform data
        $equipment->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'owner' => $item->owner->name ?? 'Unknown',
                'owner_id' => $item->owner_id,
                'type' => $item->type,
                'rate' => '₱' . number_format($item->rate_per_day, 2),
                'rate_per_day' => $item->rate_per_day,
                'available' => $item->availability_status === 'available',
                'availability_status' => $item->availability_status,
                'location' => $item->location,
                'image' => $item->image_url ?? 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop',
                'rating' => 4.5, // TODO: Calculate from reviews
                'reviews' => 0, // TODO: Count reviews
            ];
        });

        return $this->success($equipment, 'Equipment retrieved successfully');
    }

    /**
     * Display the specified equipment.
     */
    public function show(string $id)
    {
        $equipment = Equipment::with(['owner'])->findOrFail($id);

        return $this->success([
            'id' => $equipment->id,
            'name' => $equipment->name,
            'description' => $equipment->description,
            'owner' => $equipment->owner->name ?? 'Unknown',
            'owner_id' => $equipment->owner_id,
            'type' => $equipment->type,
            'rate_per_day' => $equipment->rate_per_day,
            'availability_status' => $equipment->availability_status,
            'location' => $equipment->location,
            'specifications' => $equipment->specifications,
            'image_url' => $equipment->image_url,
            'is_active' => $equipment->is_active,
        ], 'Equipment details retrieved successfully');
    }

    /**
     * Rent equipment.
     */
    public function rent(Request $request, string $id)
    {
        $request->validate([
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
        ]);

        $equipment = Equipment::findOrFail($id);

        // Check if equipment is available
        if ($equipment->availability_status !== 'available') {
            return $this->error('Equipment is not available for rent', 400);
        }

        DB::beginTransaction();
        try {
            // Calculate duration and total cost
            $startDate = new \DateTime($request->start_date);
            $endDate = new \DateTime($request->end_date);
            $duration = $startDate->diff($endDate)->days + 1;
            $totalCost = $duration * $equipment->rate_per_day;

            // Create rental record
            $rental = DB::table('equipment_rentals')->insertGetId([
                'equipment_id' => $equipment->id,
                'renter_id' => Auth::id(),
                'owner_id' => $equipment->owner_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'duration_days' => $duration,
                'rate_per_day' => $equipment->rate_per_day,
                'total_cost' => $totalCost,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Update equipment availability
            $equipment->availability_status = 'rented';
            $equipment->save();

            DB::commit();

            return $this->success([
                'rental_id' => $rental,
                'equipment_name' => $equipment->name,
                'duration_days' => $duration,
                'total_cost' => $totalCost,
                'status' => 'pending',
            ], 'Equipment rental request created successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to create rental: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get user's equipment rentals.
     */
    public function myRentals()
    {
        $rentals = DB::table('equipment_rentals')
            ->join('equipment', 'equipment_rentals.equipment_id', '=', 'equipment.id')
            ->join('users', 'equipment_rentals.owner_id', '=', 'users.id')
            ->where('equipment_rentals.renter_id', Auth::id())
            ->select(
                'equipment_rentals.*',
                'equipment.name as equipment_name',
                'equipment.image_url',
                'users.name as owner_name'
            )
            ->orderBy('equipment_rentals.created_at', 'desc')
            ->get();

        $rentals = $rentals->map(function ($rental) {
            return [
                'id' => $rental->id,
                'equipmentName' => $rental->equipment_name,
                'owner' => $rental->owner_name,
                'rentalPeriod' => $rental->duration_days . ' days',
                'totalCost' => '₱' . number_format($rental->total_cost, 2),
                'status' => ucfirst($rental->status),
                'startDate' => date('M d, Y', strtotime($rental->start_date)),
                'endDate' => date('M d, Y', strtotime($rental->end_date)),
                'image' => $rental->image_url ?? 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=100&h=100&fit=crop',
            ];
        });

        return $this->success($rentals, 'User rentals retrieved successfully');
    }
}
