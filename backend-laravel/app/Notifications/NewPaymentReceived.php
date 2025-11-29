<?php

namespace App\Notifications;

use App\Models\AuctionPayment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewPaymentReceived extends Notification
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
            'type' => 'payment_received',
            'title' => 'New Payment Received',
            'message' => "₱{$this->payment->amount} payment received from {$this->payment->buyer->name} for {$this->payment->listing->title}",
            'payment_id' => $this->payment->id,
            'bid_id' => $this->payment->bid_id,
            'amount' => $this->payment->amount,
            'buyer_name' => $this->payment->buyer->name,
            'listing_title' => $this->payment->listing->title,
            'action_url' => "/api/v1/auction-payments/{$this->payment->id}",
        ];
    }
}
