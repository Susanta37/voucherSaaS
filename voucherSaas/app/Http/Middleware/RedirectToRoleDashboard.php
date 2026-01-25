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

        if (! $user) {
            return $next($request);
        }

        // If user is visiting "/", send to correct dashboard
        if ($request->is('/')) {
            return redirect()->to($this->dashboardUrl($user));
        }

        return $next($request);
    }

    private function dashboardUrl($user): string
    {
        if ($user->hasRole('super_admin')) {
            return '/super-admin/dashboard';
        }

        if ($user->hasRole('company_admin')) {
            return '/admin/dashboard';
        }

        if ($user->hasRole('branch_admin')) {
            return '/branch/dashboard';
        }

        return '/employee/dashboard';
    }
}
