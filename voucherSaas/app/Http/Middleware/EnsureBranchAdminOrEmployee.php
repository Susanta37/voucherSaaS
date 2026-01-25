<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureBranchAdminOrEmployee
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        if (! $user->hasAnyRole(['branch_admin', 'employee'])) {
            abort(403);
        }

        if (! $user->company_id || ! $user->branch_id) {
            abort(403, 'Branch access not assigned.');
        }

        return $next($request);
    }
}
