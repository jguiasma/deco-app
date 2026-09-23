<?php

namespace App\Notifications;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectStatusUpdated extends Notification
{
    use Queueable;

    public function __construct(private readonly Project $project)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $status = [
            'planning' => 'en préparation',
            'in_progress' => 'en cours de réalisation',
            'installation' => 'en cours d’installation',
            'completed' => 'terminé',
            'cancelled' => 'annulé',
        ][$this->project->status] ?? $this->project->status;

        return (new MailMessage)
            ->subject('Mise à jour de votre projet — Ben Wada Déco')
            ->greeting('Bonjour,')
            ->line("Votre projet « {$this->project->title} » est maintenant : {$status}.")
            ->line('Nous vous tiendrons informé(e) de chaque nouvelle étape.')
            ->line('Merci de votre confiance.')
            ->salutation('L’équipe Ben Wada Déco');
    }
}
