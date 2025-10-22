<?php

namespace App\Models;

class Collection extends CoreModel
{
    protected $table = 'collections';
    protected $fillable = ['name', 'attribute_ids', 'status', 'slug', 'index'];
    protected $casts = [
        'attribute_ids' => 'array',
    ];

    /* Get the hashid for the collection (for frontend use) :: */
    public function getHashidAttribute(): string
    {
        return $this->getRouteKey();
    }

    /**
     * Get attributes by IDs stored in attribute_ids array
     */
    public function attributes()
    {
        if (empty($this->attribute_ids)) {
            return collect([]);
        }

        return Attribute::whereIn('id', $this->attribute_ids)
            ->orderByRaw('FIELD(id, ' . implode(',', $this->attribute_ids) . ')')
            ->get();
    }
}
