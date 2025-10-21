<?php

namespace App\Http\Controllers\Backend;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\AttributeValue;
use Illuminate\Support\Str;

class AttributeController extends Controller
{
    public function index()
    {
        $attributes = Attribute::orderBy('index', 'asc')->get();
        return Inertia::render('backend/attributes/index', compact('attributes'));
    }

    public function create()
    {
        return Inertia::render('backend/attributes/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate($this->rules, $this->customMessages);

        // Get the next index value
        $maxIndex = Attribute::max('index') ?? 0;

        $attribute = new Attribute;
        $attribute->fill($request->all());
        $attribute->slug = Str::slug($request->name);
        $attribute->index = $maxIndex + 1;
        $attribute->status = 'INACTIVE'; // Default status
        $attribute->is_color = $request->is_color == '1' ? true : false;
        $attribute->save();

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute created successfully.');
    }

    public function show(Attribute $attribute)
    {
        // Load creator and updator relationships
        $attribute->load([
            'createdBy:id,first_name,last_name',
            'updatedBy:id,first_name,last_name'
        ]);

        return Inertia::render('backend/attributes/show', compact('attribute'));
    }

    public function edit(Attribute $attribute)
    {
        return Inertia::render('backend/attributes/edit', compact('attribute'));
    }

    public function update(Request $request, Attribute $attribute): RedirectResponse
    {
        // Update validation rules to exclude current attribute from unique check
        $this->rules['name'] = 'required|string|max:100|unique:attributes,name,' . $attribute->id;
        $request->validate($this->rules, $this->customMessages);

        $attribute->fill($request->all());
        $attribute->slug = Str::slug($request->name);
        $attribute->is_color = $request->is_color == '1' ? true : false;
        $attribute->save();

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute updated successfully.');
    }

    public function destroy(Attribute $attribute)
    {
        $attribute->delete();
        return redirect()->route('admin.attributes.index')->with('success', 'Attribute deleted successfully.');
    }

    /** @var array<string, string> Validation rules */
    private array $rules = [
        'name' => 'required|string|max:100|unique:attributes,name',
        'label' => 'required|string|max:100',
        'is_color' => 'required|in:0,1',
    ];

    /** @var array<string, string> Custom validation messages */
    private array $customMessages = [
        'name.required' => 'Name is required',
        'name.string' => 'Name must be a string',
        'name.max' => 'Name must not exceed 100 characters',
        'name.unique' => 'This attribute name already exists',
        'label.required' => 'Label is required',
        'label.string' => 'Label must be a string',
        'label.max' => 'Label must not exceed 100 characters',
        'is_color.required' => 'Is Color field is required',
        'is_color.in' => 'Is Color must be either Yes or No',
    ];
}
