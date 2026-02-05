<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectToRoleDashboard
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // If user is visiting "/" but is logged in, send them to /dashboard 
        // which will trigger the Controller redirect logic.
        if ($user && $request->is('/')) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}