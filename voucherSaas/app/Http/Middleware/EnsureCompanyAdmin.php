<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCompanyAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if (! $user->hasRole('company_admin')) {
            abort(403);
        }

        if (! $user->company_id) {
            abort(403, 'Company is not assigned.');
        }

        return $next($request);
    }
}
