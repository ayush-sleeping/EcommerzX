<?php

use App\Models\User;
use Inertia\Inertia;
use App\Services\QueryCacheService;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backend\RoleController;
use App\Http\Controllers\Backend\UserController;
use App\Http\Controllers\Backend\EnquiryController;
use App\Http\Controllers\Backend\ProductController;
use App\Http\Controllers\Backend\CategoryController;
use App\Http\Controllers\Backend\CustomerController;
use App\Http\Controllers\Backend\EmployeeController;
use App\Http\Controllers\Backend\AnalyticsController;
use App\Http\Controllers\Backend\AttributeController;
use App\Http\Controllers\Backend\DashboardController;
use App\Http\Controllers\Backend\CollectionController;

// Backend Routes
// -------------------------------------------------------------------------------------------------------- ::
Route::middleware(['auth', 'verified', 'admin', 'preventBackHistory'])->group(function () {

    // Main dashboard route - direct access
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin prefix for all backend routes
    // -------------------------------------------------------------------------------------------------------- ::
    Route::prefix('admin')->name('admin.')->group(function () {

        // Users
        Route::resource('users', UserController::class);
        Route::post('users/data', [UserController::class, 'data'])->name('users.data');
        Route::post('users/list', [UserController::class, 'list'])->name('users.list');
        Route::post('users/change-status', [UserController::class, 'changeStatus'])->name('users.change.status');

        // Roles
        Route::resource('roles', RoleController::class);
        Route::post('roles/data', [RoleController::class, 'data'])->name('roles.data');
        Route::post('roles/list', [RoleController::class, 'list'])->name('roles.list');

        // Permissions
        Route::get('roles/{role}/permission/show', [RoleController::class, 'permissionsShow'])->name('roles.permissions.show');
        Route::post('roles/{role}/permission/update', [RoleController::class, 'permissionsUpdate'])->name('roles.permissions.update');

        // Employees
        Route::resource('employees', EmployeeController::class);
        Route::post('employees/data', [EmployeeController::class, 'data'])->name('employees.data');
        Route::post('employees/list', [EmployeeController::class, 'list'])->name('employees.list');
        Route::post('employees/change-status', [EmployeeController::class, 'changeStatus'])->name('employees.change.status');

        // Customers
        Route::resource('customers', CustomerController::class);
        Route::post('customers/data', [CustomerController::class, 'data'])->name('customers.data');
        Route::post('customers/list', [CustomerController::class, 'list'])->name('customers.list');
        Route::post('customers/change-status', [CustomerController::class, 'changeStatus'])->name('customers.change.status');

        // Enquiries
        Route::resource('enquiries', EnquiryController::class);
        Route::post('enquiries/data', [EnquiryController::class, 'data'])->name('enquiries.data');
        Route::post('enquiries/list', [EnquiryController::class, 'list'])->name('enquiries.list');
        Route::post('enquiries/{enquiry}/remark', [EnquiryController::class, 'updateRemark'])->name('enquiries.update.remark');

        // Analytics
        Route::resource('analytics', AnalyticsController::class);


        // Product related routes ::
        // ---------------------------------------------------------------- ::

        // Attributes
        Route::resource('attributes', AttributeController::class);
        Route::post('attributes/data', [AttributeController::class, 'data'])->name('attributes.data');
        Route::post('attributes/list', [AttributeController::class, 'list'])->name('attributes.list');
        Route::post('attributes/change-status', [AttributeController::class, 'changeStatus'])->name('attributes.change.status');

        // Collections
        Route::resource('collections', CollectionController::class);
        Route::post('collections/data', [CollectionController::class, 'data'])->name('collections.data');
        Route::post('collections/list', [CollectionController::class, 'list'])->name('collections.list');
        Route::post('collections/change-status', [CollectionController::class, 'changeStatus'])->name('collections.change.status');

        // Categories
        Route::resource('categories', CategoryController::class);
        Route::post('categories/data', [CategoryController::class, 'data'])->name('categories.data');
        Route::post('categories/list', [CategoryController::class, 'list'])->name('categories.list');
        Route::post('categories/change-status', [CategoryController::class, 'changeStatus'])->name('categories.change.status');

        // Products
        Route::resource('products', ProductController::class);
        Route::post('products/data', [ProductController::class, 'data'])->name('products.data');
        Route::post('products/list', [ProductController::class, 'list'])->name('products.list');
        Route::post('products/change-status', [ProductController::class, 'changeStatus'])->name('products.change.status');
        Route::post('products/change-sale', [ProductController::class, 'changeSale'])->name('products.change.sale');

        // End of File
    });
});

// Cache test route
// -------------------------------------------------------------------------------------------------------- ::
Route::get('/test-cache', function () {
    $start = microtime(true);

    // Test cached user count
    $userCount = User::cachedCount();

    // Test cached recent users
    $recentUsers = User::cachedLatest(5, 'recent.5');

    // Test query cache service directly
    $appSettings = QueryCacheService::remember(
        'app.test.settings',
        fn () => [
            'name' => config('app.name'),
            'env' => app()->environment(),
            'version' => config('app.version', '1.0.0'),
            'timezone' => config('app.timezone'),
        ],
        600
    );

    $end = microtime(true);
    $executionTime = round(($end - $start) * 1000, 2);

    return response()->json([
        'message' => 'Cache test completed',
        'execution_time_ms' => $executionTime,
        'data' => [
            'user_count' => $userCount,
            'recent_users_count' => $recentUsers->count(),
            'app_settings' => $appSettings,
        ],
        'cache_stats' => QueryCacheService::getStats(),
        'user_cache_stats' => User::getCacheStats(),
    ]);
})->name('test.cache');
