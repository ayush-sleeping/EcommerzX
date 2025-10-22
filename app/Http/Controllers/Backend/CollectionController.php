<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use App\Models\Attribute;
use App\Models\Collection;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class CollectionController extends Controller
{
    public function index()
    {
        $collections = Collection::orderBy('id')->get();
        return Inertia::render('backend/collections/index', [
            'collections' => $collections,
        ]);
    }

    public function create()
    {
        $attributes = Attribute::where('status', 'ACTIVE')
            ->orderBy('index')
            ->get(['id', 'name', 'label']);

        $nextIndex = Collection::max('index') + 1;

        return Inertia::render('backend/collections/create', [
            'attributes' => $attributes,
            'nextIndex' => $nextIndex,
        ]);
    }

    public function store(Request $request)
    {
        $rules = $this->rules;
        $rules['name'] = 'required|string|max:255|unique:collections,name';

        $request->validate($rules, $this->customMessages);

        $collection = new Collection();
        $collection->fill($request->all());
        $collection->slug = Str::slug($request->name);
        $collection->status = 'ACTIVE';
        $collection->save();

        return redirect()->route('admin.collections.index')
            ->with('success', 'Collection created successfully.');
    }

    public function show(Collection $collection)
    {
        $attributes = $collection->attributes();

        return Inertia::render('backend/collections/show', [
            'collection' => $collection,
            'attributes' => $attributes,
        ]);
    }

    public function edit(Collection $collection)
    {
        $attributes = Attribute::where('status', 'ACTIVE')
            ->orderBy('index')
            ->get(['id', 'name', 'label']);

        return Inertia::render('backend/collections/edit', [
            'collection' => $collection,
            'attributes' => $attributes,
        ]);
    }

    public function update(Request $request, Collection $collection)
    {
        $rules = $this->rules;
        $rules['name'] = 'required|string|max:255|unique:collections,name,' . $collection->id;

        $request->validate($rules, $this->customMessages);

        $collection->fill($request->all());
        $collection->slug = Str::slug($request->name);
        $collection->save();

        return redirect()->route('admin.collections.index')
            ->with('success', 'Collection updated successfully.');
    }

    public function destroy(Collection $collection)
    {
        $collection->delete();

        return redirect()->route('admin.collections.index')
            ->with('success', 'Collection deleted successfully.');
    }

    public function changeStatus(Request $request): RedirectResponse
    {
        $request->validate([
            'collection_id' => 'required|integer|exists:collections,id',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $collection = Collection::findOrFail($request->collection_id);
        $collection->status = $request->status;
        $collection->save();

        return redirect()->route('admin.collections.index')->with('success', 'Collection status updated successfully.');
    }

    protected $rules = [
        'name' => 'required|string|max:255',
        'attribute_ids' => 'required|array|min:1',
        'attribute_ids.*' => 'exists:attributes,id',
        'index' => 'required|integer',
    ];

    protected $customMessages = [
        'name.required' => 'Collection name is required.',
        'name.unique' => 'Collection name already exists.',
        'attribute_ids.required' => 'At least one attribute must be selected.',
        'attribute_ids.min' => 'At least one attribute must be selected.',
    ];
}
