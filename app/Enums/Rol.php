<?php

namespace App\Enums;

/**
 * Los roles de las cuentas. En `users.rol` se guarda el slug; la etiqueta es la
 * que se muestra. `desde()` acepta las dos formas.
 */
enum Rol: string
{
    case Admin = 'admin';
    case Coordinador = 'coordinador';
    case Usuario = 'usuario';

    /** Nombre del dominio, tal como aparece en pantalla. */
    public function etiqueta(): string
    {
        return match ($this) {
            self::Admin => 'Administrador (Gestión de Bienes)',
            self::Coordinador => 'Coordinador / Jefe de área',
            self::Usuario => 'Usuario',
        };
    }

    /** null si no es ni slug ni etiqueta de ningún rol, para que un valor escrito a mano no reviente la comparación. */
    public static function desde(self|string $valor): ?self
    {
        if ($valor instanceof self) {
            return $valor;
        }

        return self::tryFrom($valor)
            ?? collect(self::cases())->first(fn (self $rol) => $rol->etiqueta() === $valor);
    }
}
