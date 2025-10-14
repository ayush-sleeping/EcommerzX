<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductPhoto extends Model
{
    use HasFactory;
    protected $table = 'productphotos';
    protected $fillable = [
        'product_id', 'attribute_id', 'attributevalue_id', 'thumbnail', 'main_photo',
        'other_photos', 'video', 'status', 'default', 'slug', 'index',
    ];

    protected $casts = [
        'other_photos' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function attributevalue()
    {
        return $this->belongsTo(AttributeValue::class);
    }
}
