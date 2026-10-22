<?php

namespace App\Models;

use App\Enums\Rol;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

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

    protected $appends = ['activo'];

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'rol' => Rol::class,
            'fecha_baja' => 'datetime',
        ];
    }

    /** ¿Tiene alguno de estos roles? Acepta el enum, el slug o la etiqueta. */
    public function tieneRol(Rol|string ...$roles): bool
    {
        foreach ($roles as $rol) {
            if (Rol::desde($rol) === $this->rol) {
                return true;
            }
        }

        return false;
    }

    /** Sin baja. Dar de baja una cuenta que ya la tenía conserva la fecha original. */
    protected function activo(): Attribute
    {
        return Attribute::make(
            get: fn ($valor, array $atributos) => ($atributos['fecha_baja'] ?? null) === null,
            set: fn ($activo, array $atributos) => [
                'fecha_baja' => $activo ? null : ($atributos['fecha_baja'] ?? now()),
            ],
        );
    }

    /**
     * Usuarios habilitados para operar y para figurar como responsables de un bien.
     */
    public function scopeActivos($query)
    {
        return $query->whereNull('fecha_baja');
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
