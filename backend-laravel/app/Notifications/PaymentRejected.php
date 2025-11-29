<?php

namespace App\Notifications;

use App\Models\AuctionPayment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentRejected extends Notification
{
    use Queueable;

    public $payment;

    /**
     * Create a new notification instance.
     */
    public function __construct(AuctionPayment $payment)
    {
        $this->payment = $payment;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray($notifiable): array
    {
        return [
            'type' => 'payment_rejected',
            'title' => 'Payment Rejected',
            'message' => "Your payment of ₱{$this->payment->amount} for {$this->payment->listing->title} was rejected",
            'payment_id' => $this->payment->id,
            'bid_id' => $this->payment->bid_id,
            'amount' => $this->payment->amount,
            'listing_title' => $this->payment->listing->title,
            'rejection_reason' => $this->payment->rejection_reason,
            'action_url' => "/api/v1/auction-payments/{$this->payment->id}",
        ];
    }
}
