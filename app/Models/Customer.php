<?php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends CoreModel
{
    protected $fillable = ['user_id', 'customer_id', 'personal_email', 'type'];

    /* Get the hashid for the customer (for frontend use) :: */
    public function getHashidAttribute(): string
    {
        return $this->getRouteKey();
    }

    /**
     * @return BelongsTo<User, Customer>
     */
    public function user(): BelongsTo
    {
        /** @phpstan-ignore-next-line */
        return $this->belongsTo(User::class);
    }
}
