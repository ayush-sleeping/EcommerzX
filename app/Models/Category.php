<?php

namespace App\Models;

class Category extends CoreModel
{
    protected $table = 'categories';
    protected $fillable = ['status', 'name', 'slug', 'index', 'collection_id', 'product_available_value_ids', 'header_index', 'sub_header_index', 'photo'];
    protected $casts = [
        'product_available_value_ids' => 'array',
    ];

    /* Get the hashid for the category (for frontend use) :: */
    public function getHashidAttribute(): string
    {
        return $this->getRouteKey();
    }

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }
}
