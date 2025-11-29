<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Traits\ApiResponses;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponses;

    /**
     * Display user's notifications.
     */
    public function index()
    {
        Log::info('NotificationController index called', [
            'user_id' => Auth::id(),
        ]);
        
        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        Log::info('Notifications found', ['count' => $notifications->count()]);

        $notifications = $notifications->map(function ($notification) {
            return [
                'id' => $notification->id,
                'message' => $notification->message,
                'type' => $notification->type,
                'time' => $this->getTimeAgo($notification->created_at),
                'is_read' => (bool) $notification->is_read,
                'created_at' => $notification->created_at->format('M d, Y H:i'),
            ];
        });

        return $this->ok('Notifications retrieved successfully', $notifications);
    }

    /**
     * Get unread notifications count.
     */
    public function unreadCount()
    {
        $count = Notification::where('user_id', Auth::id())
            ->unread()
            ->count();

        return $this->ok('Unread count retrieved', ['unread_count' => $count]);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(string $id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->findOrFail($id);

        $notification->is_read = true;
        $notification->read_at = now();
        $notification->save();

        return $this->ok('Notification marked as read', null);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return $this->ok('All notifications marked as read', null);
    }

    /**
     * Delete a notification.
     */
    public function destroy(string $id)
    {
        $notification = Notification::where('user_id', Auth::id())
            ->findOrFail($id);

        $notification->delete();

        return $this->ok('Notification deleted successfully', null);
    }

    /**
     * Get human-readable time ago.
     */
    private function getTimeAgo($datetime)
    {
        $now = now();
        $diff = $datetime->diff($now);

        if ($diff->d > 0) {
            return $diff->d . ' day' . ($diff->d > 1 ? 's' : '') . ' ago';
        } elseif ($diff->h > 0) {
            return $diff->h . ' hour' . ($diff->h > 1 ? 's' : '') . ' ago';
        } elseif ($diff->i > 0) {
            return $diff->i . ' min' . ($diff->i > 1 ? 's' : '') . ' ago';
        } else {
            return 'Just now';
        }
    }
}
