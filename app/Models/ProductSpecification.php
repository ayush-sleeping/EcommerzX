<?php

namespace App\Models;

use App\Models\Product;
use App\Traits\Hashidable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductSpecification extends Model
{
    use HasFactory, Hashidable;
    protected $table = 'productspecifications';
    protected $fillable = ['product_id','name','value',];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
