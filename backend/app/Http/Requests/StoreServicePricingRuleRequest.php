<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServicePricingRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'unit' => ['required', 'in:m2,meter,piece'],
            'calculation_method' => ['required', 'in:fixed,per_unit,prorata'],
            'reference_quantity' => [
                'nullable',
                'numeric',
                'gt:0',
                'required_if:calculation_method,prorata',
            ],
            'min_price' => ['required', 'numeric', 'min:0'],
            'max_price' => ['required', 'numeric', 'gte:min_price'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
