<?php

namespace App\Models;

use DataTables;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\Hashidable;
use App\Models\Category;

class Product extends Model
{
    use HasFactory;
    protected $table = 'products';
    protected $fillable = [
        'name',
        'slug',
        'category_ids',
        'attribute_id',
        'status',
        'sale',
        'index',
        'featured',
        'model',
        'short_description',
        'description',
        'views_count',
        'reviews_count',
        'rating',
        'specification_title',
        'sku',
        'hsn',
        'pattern',
    ];

    protected $casts = [
        'category_ids' => 'array',
    ];
    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attribute_id');
    }

    public function getCategoryNamesAttribute()
    {
        return Category::whereIn('id', $this->category_ids)->pluck('name');
    }

    public function photos()
    {
        return $this->hasMany(ProductPhoto::class);
    }

    public function prices()
    {
        return $this->hasMany(ProductPrice::class, 'product_id');
    }

    public function specifications()
    {
        return $this->hasMany(ProductSpecification::class, 'product_id');
    }
}
