<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\JsonResponse;


class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Customer::with('user:id, first_name, last_name, email, status');

        // Apply status filter if provided
        if ($request->has('status') && in_array($request->status, ['ACTIVE', 'INACTIVE'])) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('status', $request->status);
            });
        }

        $customers = $query->get();

        return Inertia::render('backend/customers/index', [
            'customers' => $customers,
            'filters' => [
                'status' => $request->status,
            ],
        ]);
    }
}
