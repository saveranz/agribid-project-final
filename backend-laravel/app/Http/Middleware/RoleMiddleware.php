<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

//php artisan make:middleware RoleMiddleware
class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        //@var \closure(\Illuminate\Http\Request): (typeof response) $next
        //php artisan make:middleware RoleMiddleware
        //public function handle(Request $request, Closure $next, ...$roles): Response
        // {
        if (!$user = $request->user()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (!in_array($user->role, $roles)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}
