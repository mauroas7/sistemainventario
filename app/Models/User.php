<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
    'name',
    'email',
    'password',
    'rol',
    'activo',
    'area_id',
];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'activo' => 'boolean',
        ];
    }

    /**
     * Usuarios habilitados para operar y para figurar como responsables de un bien.
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Área a la que pertenece el usuario.
     */
    public function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }

    /**
     * Movimientos creados por el usuario.
     */
    public function movimientosCreados(): HasMany
    {
        return $this->hasMany(
            Movimiento::class,
            'creado_por'
        );
    }

    /**
     * Movimientos recibidos por el usuario.
     */
    public function movimientosRecibidos(): HasMany
    {
        return $this->hasMany(
            Movimiento::class,
            'recibido_por'
        );
    }
}
