<?php

namespace App\Notifications;

use App\Models\Quote;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class QuoteSentToClient extends Notification
{
    use Queueable;

    public function __construct(private readonly Quote $quote)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $this->quote->loadMissing(['items', 'quoteRequest']);
        $firstName = $this->quote->quoteRequest?->first_name;
        $pdf = Pdf::loadView('pdf.quote', ['quote' => $this->quote])
            ->setPaper('a4')
            ->output();

        return (new MailMessage)
            ->subject("Votre devis {$this->quote->quote_number} — Ben Wada Déco")
            ->greeting($firstName ? "Bonjour {$firstName}," : 'Bonjour,')
            ->line('Votre devis est prêt. Vous le trouverez en pièce jointe de cet e-mail.')
            ->line("Montant total : {$this->quote->total} {$this->quote->currency}.")
            ->line('Nous restons à votre disposition pour toute question.')
            ->salutation('L’équipe Ben Wada Déco')
            ->attachData($pdf, "devis-{$this->quote->quote_number}.pdf", [
                'mime' => 'application/pdf',
            ]);
    }
}
