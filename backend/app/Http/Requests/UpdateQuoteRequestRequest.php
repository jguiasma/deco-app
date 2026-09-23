<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuoteRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => [
                'sometimes',
                'in:new,contacted,quoted,accepted,rejected',
            ],
            'admin_notes' => ['nullable', 'string', 'max:3000'],
        ];
    }
}