<?php

namespace App\Notifications;

use App\Models\Bid;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AuctionWon extends Notification
{
    use Queueable;

    public $bid;

    /**
     * Create a new notification instance.
     */
    public function __construct(Bid $bid)
    {
        $this->bid = $bid;
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
            'type' => 'auction_won',
            'title' => 'Congratulations! You Won the Auction',
            'message' => "You won the auction for {$this->bid->listing->title} with a bid of ₱{$this->bid->winning_bid_amount}. Please make your payment by {$this->bid->payment_deadline->format('M d, Y')}.",
            'bid_id' => $this->bid->id,
            'listing_id' => $this->bid->listing_id,
            'listing_title' => $this->bid->listing->title,
            'winning_amount' => $this->bid->winning_bid_amount,
            'minimum_downpayment' => $this->bid->minimum_downpayment,
            'payment_deadline' => $this->bid->payment_deadline,
            'action_url' => "/api/v1/bids/{$this->bid->id}/payment-status",
        ];
    }
}
