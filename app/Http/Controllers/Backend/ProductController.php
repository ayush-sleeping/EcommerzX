<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('index', 'asc')->get();
        $categories = Category::where('status', 'ACTIVE')->get();
        return Inertia::render('backend/products/index', compact('products', 'categories'));
    }

    public function create()
    {
        $categories = Category::where('status', 'ACTIVE')
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);

        $nextIndex = Product::max('index') + 1;

        return Inertia::render('backend/products/create', compact('categories', 'nextIndex'));
    }

    public function store(Request $request)
    {
        // Validate the request
        $request->validate($this->rules, $this->customMessages);

        // Create and save the product
        $product = new Product();
        $product->slug = Str::slug($request->slug);
        $product->name = $request->name;
        $product->category_ids = $request->category_ids;
        $product->sku = $request->sku;
        $product->hsn = $request->hsn;
        $product->index = $request->index;
        $product->short_description = $request->short_description;
        $product->description = $request->description;
        $product->status = 'ACTIVE'; // Default status
        $product->sale = 'INACTIVE'; // Default sale status
        $product->save();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $categories = Category::where('status', 'ACTIVE')
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);

        return Inertia::render('backend/products/edit', compact('product', 'categories'));
    }

    public function update(Request $request, Product $product)
    {
        // Custom validation rules for update (exclude current product from unique checks)
        $updateRules = $this->rules;
        $updateRules['slug'] = 'required|string|unique:products,slug,' . $product->id;
        $updateRules['sku'] = 'required|string|unique:products,sku,' . $product->id;

        // Validate the request
        $request->validate($updateRules, $this->customMessages);

        // Update the product
        $product->slug = Str::slug($request->slug);
        $product->name = $request->name;
        $product->category_ids = $request->category_ids;
        $product->sku = $request->sku;
        $product->hsn = $request->hsn;
        $product->index = $request->index;
        $product->short_description = $request->short_description;
        $product->description = $request->description;
        $product->save();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function show(Product $product)
    {
        // Load categories with names
        $categories = Category::whereIn('id', $product->category_ids ?? [])->get();

        return Inertia::render('backend/products/show', compact('product', 'categories'));
    }

    public function changeStatus(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $product = Product::findOrFail($request->product_id);
        $product->status = $request->status;
        $product->save();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product status updated successfully.');
    }

    public function changeSale(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'sale' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $product = Product::findOrFail($request->product_id);
        $product->sale = $request->sale;
        $product->save();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product sale status updated successfully.');
    }

    public function destroy(Product $product)
    {
        // Delete related records first (if any)
        // $product->photos()->delete();
        // $product->prices()->delete();
        // $product->specifications()->delete();

        // Delete the product
        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    protected $rules = [
        'name' => 'required|string|max:255',
        'slug' => 'required|string|unique:products,slug',
        'category_ids' => 'required|array',
        'category_ids.*' => 'exists:categories,id',
        'sku' => 'required|string|unique:products,sku',
        'hsn' => 'nullable|string',
        'index' => 'required|integer',
        'short_description' => 'required|string',
        'description' => 'required|string',
    ];

    protected $customMessages = [
        'name.required' => 'Product name is required.',
        'slug.required' => 'Product slug is required.',
        'slug.unique' => 'Product slug already exists.',
        'category_ids.required' => 'At least one category is required.',
        'category_ids.*.exists' => 'Selected category does not exist.',
        'sku.required' => 'SKU is required.',
        'sku.unique' => 'SKU already exists.',
        'index.required' => 'Index is required.',
        'short_description.required' => 'Short description is required.',
        'description.required' => 'Description is required.',
    ];
}
