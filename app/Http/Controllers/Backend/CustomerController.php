<?php

namespace App\Http\Controllers\Backend;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * CODE STRUCTURE SUMMARY:
 * CustomerController ( Handles CRUD operations for customers with user management, Integrates with roles and permissions system. )
 * Display a listing of customers
 * Show the form for creating a new customer
 * Store a newly created customer
 * Display the specified customer
 * Show the form for editing the specified customer
 * Update the specified customer
 * Remove the specified customer
 * Change customer status (activate/deactivate)
 * Sync user permissions based on assigned roles
 * Validation rules
 * Custom validation messages
 */
class CustomerController extends Controller
{
    /* Display a listing of customers :: */
    public function index(Request $request): Response
    {
        $query = Customer::with('user:id,first_name,last_name,email,mobile,status');

        // Apply status filter if provided
        if ($request->filled('status') && in_array($request->status, ['ACTIVE', 'INACTIVE'])) {
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

    /* Show the form for creating a new customer :: */
    public function create(): Response
    {
        $systemRoles = get_system_roles();
        $roles = Role::whereNotIn('name', $systemRoles)
            ->get()
            ->map(function ($role) {
                return [
                    'name' => $role->name,
                    'display_name' => $role->display_name ?? $role->name,
                ];
            });

        $customerId = get_counting_number('Customer', 'CUST', 'customer_id', false);

        return Inertia::render('backend/customers/create', [
            'customer' => null,
            'roles' => $roles,
            'customer_id' => $customerId,
            'mode' => 'create',
        ]);
    }

    /* Store a newly created customer :: */
    public function store(Request $request): RedirectResponse
    {
        $request->validate($this->rules, $this->customMessages);

        $user = new User;
        $user->fill($request->all());
        $user->password = bcrypt($request->password);
        $user->save();

        $user->assignRole($request->roles);
        $this->syncUserPermissions($user, $request->roles);

        $customer = new Customer;
        $customer->fill($request->all());
        $customer->user_id = $user->id;
        $customer->type = 'customer';
        $customer->save();

        return redirect()->route('admin.customers.index')->with('success', 'Customer created successfully.');
    }

    /* Display the specified customer :: */
    public function show(Customer $customer): Response
    {
        // Load the user relationship with roles and permissions
        $customer->load([
            'user.roles:id,name',
            'user.permissions:id,name',
            'user.creator:id,first_name,last_name',
            'user.updator:id,first_name,last_name'
        ]);

        return Inertia::render('backend/customers/show', compact('customer'));
    }

    /* Show the form for editing the specified customer :: */
    public function edit(Customer $customer): Response
    {
        // Load the user relationship if not already loaded
        $customer->load('user.roles');

        $systemRoles = get_system_roles();
        $roles = Role::whereNotIn('name', $systemRoles)
            ->get()
            ->map(function ($role) {
                return [
                    'name' => $role->name,
                    'display_name' => $role->display_name ?? $role->name,
                ];
            });

        return Inertia::render('backend/customers/edit', [
            'customer' => $customer,
            'roles' => $roles,
            'mode' => 'edit',
        ]);
    }

    /* Update the specified customer :: */
    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $this->rules['email'] = 'required|email|unique:users,email,'.$customer->user->id;
        $this->rules['personal_email'] = 'nullable|email|unique:customers,personal_email,'.$customer->id;
        $this->rules['mobile'] = 'required|digits:10|unique:users,mobile,'.$customer->user->id;
        $this->rules['password'] = 'nullable|min:6';
        $this->rules['password_confirmation'] = 'nullable|same:password';

        $request->validate($this->rules, $this->customMessages);

        $user = User::find($customer->user->id);
        $user->fill($request->all());
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        $user->save();

        $user->syncRoles([]);
        $user->assignRole($request->roles);
        $this->syncUserPermissions($user, $request->roles);

        $customer->fill($request->all());
        $customer->save();

        return redirect()->route('admin.customers.index')->with('success', 'Customer updated successfully.');
    }

    /* Remove the specified customer :: */
    public function destroy(string $id): JsonResponse
    {
        $customer = Customer::findByHashid($id);

        if (! $customer) {
            return response()->json([
                'status' => 'error',
                'message' => 'Customer not found',
            ], 404);
        }

        try {
            DB::beginTransaction();

            $userName = $customer->user ? $customer->user->first_name.' '.$customer->user->last_name : $customer->customer_id;

            // Delete user (this will cascade delete customer due to foreign key)
            if ($customer->user) {
                $customer->user->delete();
            }
            $customer->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => "Customer {$userName} deleted successfully",
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete customer: '.$e->getMessage(),
            ], 500);
        }
    }

    /* Change customer status (activate/deactivate) :: */
    public function changeStatus(Request $request): JsonResponse
    {
        $request->validate([
            'route_key' => 'required|string',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $customer = Customer::findByHashid($request->route_key);

        if (! $customer || ! $customer->user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Customer not found',
            ], 404);
        }

        try {
            $customer->user->status = $request->status;
            $customer->user->save();

            return response()->json([
                'status' => 'success',
                'message' => $customer->user->first_name.' has been marked '.strtolower($request->status).' successfully',
                'customer' => [
                    'id' => $customer->getRouteKey(),
                    'status' => $customer->user->status,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update status: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Sync user permissions based on assigned roles
     *
     * @param  array<string>  $roleNames
     */
    private function syncUserPermissions(User $user, array $roleNames): void
    {
        $permissions = collect();

        foreach ($roleNames as $roleName) {
            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $permissions = $permissions->merge($role->permissions);
            }
        }

        $user->syncPermissions($permissions->unique('id'));
    }

    /** @var array<string, string> Validation rules */
    private array $rules = [
        'first_name' => 'required|regex:/^[\pL\s\-]+$/u|max:50',
        'last_name' => 'required|regex:/^[\pL\s\-]+$/u|max:50',
        'email' => 'required|email|unique:users,email',
        'personal_email' => 'nullable|email|unique:customers,personal_email',
        'mobile' => 'required|digits:10|unique:users,mobile',
        'password' => 'required|min:8|confirmed',
        'roles' => 'required|array|min:1',
        'roles.*' => 'exists:roles,name',
        'type' => 'nullable|string|max:100',
        'status' => 'required|in:ACTIVE,INACTIVE',
    ];

    /** @var array<string, string> Custom validation messages */
    private array $customMessages = [
        'first_name.required' => 'First Name is required',
        'first_name.regex' => 'First Name should contain only alphabets',
        'last_name.required' => 'Last Name is required',
        'last_name.regex' => 'Last Name should contain only alphabets',
        'email.required' => 'Email is required',
        'email.email' => 'Email should be a valid email',
        'email.unique' => 'Email already exists',
        'personal_email.email' => 'Personal Email should be a valid email',
        'personal_email.unique' => 'Personal Email already exists',
        'mobile.required' => 'Mobile is required',
        'mobile.digits' => 'Mobile should be 10 digits',
        'mobile.unique' => 'Mobile already exists',
        'password.required' => 'Password is required',
        'password.min' => 'Password should be minimum 8 characters',
        'password.confirmed' => 'Password confirmation does not match',
        'roles.required' => 'At least one role is required',
        'type.nullable' => 'Customer type is required',
        'status.required' => 'Status is required',
    ];
}
