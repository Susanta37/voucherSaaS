<?php
namespace App\Http\Requests\Branch;

use Illuminate\Foundation\Http\FormRequest;

class StorePPCRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('vouchers.create');
    }

    public function rules(): array
    {
        return [
            'template_id'       => ['required', 'exists:voucher_templates,id'],
            'customer_name'     => ['required', 'string', 'max:255'],
            'customer_email'    => ['nullable', 'email', 'max:255'],
            'customer_whatsapp' => ['required', 'string', 'max:20'],
            'vehicle_model'     => ['nullable', 'string', 'max:100'],
            'vehicle_reg_no'    => ['nullable', 'string', 'max:50'],
            'send_via_email'    => ['boolean'],
            'send_via_whatsapp' => ['boolean'],
        ];
    }
}