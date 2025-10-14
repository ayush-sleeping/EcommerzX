<?php

namespace App\Models;

use App\Traits\Hashidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    use HasFactory, Hashidable;
    protected $table = 'collections';
    protected $fillable = ['name', 'attribute_ids', 'status', 'slug', 'index'];
    protected $casts = [
        'attribute_ids' => 'array',
    ];
}
