<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequireRole
{
    /**
     * Handle an incoming request.
     * Usage in route: ->middleware(\App\Http\Middleware\RequireRole::class . ':admin')
     * Multiple roles can be passed comma-separated: 'admin,coordinator'
     */
    public function handle(Request $request, Closure $next, ?string $roles = null)
    {
        $user = $request->user();

        if (! $user) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Unauthenticated.'], 401)
                : abort(401);
        }

        if (! $roles) {
            // no roles required
            return $next($request);
        }

        $allowed = array_map('trim', explode(',', $roles));

        // The user model stores role in 'rol' attribute
        $userRole = $user->rol ?? null;

        if (! $userRole || ! in_array($userRole, $allowed, true)) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Forbidden. Insufficient role.'], 403)
                : abort(403);
        }

        return $next($request);
    }
}
