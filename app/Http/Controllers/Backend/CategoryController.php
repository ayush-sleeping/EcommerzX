<?php

namespace App\Http\Controllers\Backend;

use App\Models\Category;
use App\Models\Collection;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('collection')->orderBy('index')->get();
        $collections = Collection::where('status', 'ACTIVE')->orderBy('index')->get(['id', 'name']);

        return Inertia::render('backend/categories/index', [
            'categories' => $categories,
            'collections' => $collections,
        ]);
    }

    public function create()
    {
        $collections = Collection::where('status', 'ACTIVE')->orderBy('index')->get(['id', 'name']);
        $nextIndex = Category::max('index') + 1;

        return Inertia::render('backend/categories/create', [
            'collections' => $collections,
            'nextIndex' => $nextIndex,
        ]);
    }

    public function store(Request $request)
    {
        $rules = $this->rules;
        $rules['name'] = 'required|string|max:255|unique:categories,name';

        $request->validate($rules, $this->customMessages);

        $category = new Category();
        $category->fill($request->all());
        $category->slug = Str::slug($request->name);
        $category->status = 'ACTIVE';

        if ($request->hasFile('photo')) {
            $category->photo = Storage::disk('public')->put('photos', $request->file('photo'));
        }

        $category->save();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category created successfully.');
    }

    public function show(Category $category)
    {
        $category->load('collection');

        return Inertia::render('backend/categories/show', [
            'category' => $category,
        ]);
    }

    public function edit(Category $category)
    {
        $collections = Collection::where('status', 'ACTIVE')->orderBy('index')->get(['id', 'name']);

        return Inertia::render('backend/categories/edit', [
            'category' => $category,
            'collections' => $collections,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $rules = $this->rules;
        $rules['name'] = 'required|string|max:255|unique:categories,name,' . $category->id;

        $request->validate($rules, $this->customMessages);

        $category->fill($request->all());
        $category->slug = Str::slug($request->name);

        if ($request->hasFile('photo')) {
            if ($category->photo) {
                Storage::disk('public')->delete($category->photo);
            }
            $category->photo = Storage::disk('public')->put('photos', $request->file('photo'));
        }

        $category->save();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        if ($category->photo) {
            Storage::disk('public')->delete($category->photo);
        }

        $category->delete();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category deleted successfully.');
    }

    public function changeStatus(Request $request)
    {
        $request->validate([
            'category_id' => 'required|integer|exists:categories,id',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $category = Category::findOrFail($request->category_id);
        $category->status = $request->status;
        $category->save();

        return redirect()->route('admin.categories.index')
            ->with('success', 'Category status updated successfully.');
    }


    protected $rules = [
        'name' => 'required|string|max:255',
        'collection_id' => 'required|integer|exists:collections,id',
        'index' => 'required|integer',
    ];

    protected $customMessages = [
        'name.required' => 'Category name is required.',
        'name.unique' => 'Category name already exists.',
        'collection_id.required' => 'Collection is required.',
        'collection_id.exists' => 'Selected collection does not exist.',
    ];
}
