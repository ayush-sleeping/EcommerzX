<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;

class Attribute extends CoreModel
{
    protected $table = 'attributes';
    protected $fillable = ['name', 'label', 'is_color', 'status', 'slug', 'index'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_color' => 'boolean',
    ];

    /* Get the hashid for the attribute (for frontend use) :: */
    public function getHashidAttribute(): string
    {
        return $this->getRouteKey();
    }

    /**
     * @return HasMany<AttributeValue>
     */
    public function values(): HasMany
    {
        return $this->hasMany(AttributeValue::class, 'attribute_id', 'id');
    }
}
