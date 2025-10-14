<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\Hashidable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AttributeValue extends Model
{
    use HasFactory, Hashidable;
    protected $table = 'attribute_values';
    protected $fillable = ['attribute_id', 'name', 'color', 'status', 'slug', 'index'];

    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }
}
