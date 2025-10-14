<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductPrice extends Model
{
    use HasFactory;
    protected $table = 'productprices';
    protected $fillable = [
        'product_id', 'attributevalue_ids', 'stock',
        'mrp_price', 'selling_price',
        'discount_percentage','discounted_price',
        'status', 'default','slug', 'index',
    ];

    protected $casts = [
        'attributevalue_ids' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
