<?php

namespace App\Models;

use App\Models\BaseModel;
use App\Traits\Hashidable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Categories extends Model
{
    use HasFactory, Hashidable;
    protected $table = 'categories';
    protected $fillable = ['status','name','slug','index','collection_id','product_available_value_ids','header_index','sub_header_index','photo'];
    protected $casts = [
        'product_available_value_ids' => 'array',
    ];

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }
}
