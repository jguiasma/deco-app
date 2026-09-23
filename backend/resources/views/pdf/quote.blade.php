<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: DejaVu Sans, sans-serif; color: #292524; font-size: 12px; }
        .header { border-bottom: 2px solid #b58b3a; margin-bottom: 28px; padding-bottom: 14px; }
        .brand { font-size: 25px; font-weight: bold; }
        .muted { color: #6b7280; }
        .details { width: 100%; margin: 20px 0; }
        .details td { vertical-align: top; width: 50%; }
        table.items { border-collapse: collapse; width: 100%; margin-top: 24px; }
        .items th { background: #292524; color: #fff; text-align: left; padding: 9px; }
        .items td { border-bottom: 1px solid #e5e7eb; padding: 9px; }
        .right { text-align: right; }
        .totals { margin-left: auto; margin-top: 22px; width: 45%; }
        .totals td { padding: 5px 0; }
        .total { border-top: 2px solid #292524; font-size: 14px; font-weight: bold; }
        .section { margin-top: 28px; }
        .section h3 { margin-bottom: 6px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">Ben Wada Déco</div>
        <div class="muted">Décoration intérieure &amp; fabrication sur mesure</div>
    </div>

    <h2>Devis {{ $quote->quote_number }}</h2>

    <table class="details">
        <tr>
            <td>
                <strong>Client</strong><br>
                @if($quote->quoteRequest)
                    {{ $quote->quoteRequest->first_name }} {{ $quote->quoteRequest->last_name }}<br>
                    {{ $quote->quoteRequest->phone }}<br>
                    {{ $quote->quoteRequest->email }}
                @else
                    Client à confirmer
                @endif
            </td>
            <td class="right">
                <strong>Date</strong><br>
                {{ $quote->issued_at?->format('d/m/Y') }}<br><br>
                <strong>Valide jusqu’au</strong><br>
                {{ $quote->valid_until?->format('d/m/Y') ?? 'Non précisé' }}
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th>Désignation</th>
                <th class="right">Quantité</th>
                <th class="right">Prix unitaire</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($quote->items as $item)
                <tr>
                    <td>
                        <strong>{{ $item->label }}</strong>
                        @if($item->description)<br><span class="muted">{{ $item->description }}</span>@endif
                    </td>
                    <td class="right">{{ number_format($item->quantity, 3, ',', ' ') }} {{ $item->unit }}</td>
                    <td class="right">{{ number_format($item->unit_price, 3, ',', ' ') }} DT</td>
                    <td class="right">{{ number_format($item->line_total, 3, ',', ' ') }} DT</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr><td>Sous-total</td><td class="right">{{ number_format($quote->subtotal, 3, ',', ' ') }} DT</td></tr>
        <tr><td>Remise</td><td class="right">- {{ number_format($quote->discount, 3, ',', ' ') }} DT</td></tr>
        <tr class="total"><td>Total</td><td class="right">{{ number_format($quote->total, 3, ',', ' ') }} DT</td></tr>
        <tr><td>Avance</td><td class="right">- {{ number_format($quote->deposit, 3, ',', ' ') }} DT</td></tr>
        <tr class="total"><td>Restant</td><td class="right">{{ number_format($quote->remaining, 3, ',', ' ') }} DT</td></tr>
    </table>

    @if($quote->conditions)
        <div class="section"><h3>Conditions</h3><div>{!! nl2br(e($quote->conditions)) !!}</div></div>
    @endif

    @if($quote->notes)
        <div class="section"><h3>Notes</h3><div>{!! nl2br(e($quote->notes)) !!}</div></div>
    @endif
</body>
</html>
