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

        // Create attribute values if provided (using separate arrays pattern)
        if ($request->has('value_name') && is_array($request->value_name)) {
            foreach ($request->value_name as $index => $valueName) {
                $attributeValue = new AttributeValue();
                $attributeValue->attribute_id = $attribute->id;
                $attributeValue->name = $valueName;
                $attributeValue->slug = Str::slug($valueName);
                $attributeValue->index = $index + 1;
                $attributeValue->status = 'ACTIVE'; // Default status for values

                // Conditionally set the color field
                if ($attribute->is_color && isset($request->color[$index])) {
                    $attributeValue->color = $request->color[$index];
                } else {
                    $attributeValue->color = null;
                }

                $attributeValue->save();
            }
        }

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute created successfully.');
    }

    public function show(Attribute $attribute)
    {
        // Load creator, updator relationships and attribute values
        $attribute->load([
            'createdBy:id,first_name,last_name',
            'updatedBy:id,first_name,last_name',
            'values' => function ($query) {
                $query->orderBy('index', 'asc');
            }
        ]);

        return Inertia::render('backend/attributes/show', compact('attribute'));
    }

    public function edit(Attribute $attribute)
    {
        // Load attribute values
        $attribute->load('values');
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

        // Handle deleted values
        if ($request->has('deleted_values') && !empty($request->deleted_values)) {
            $deletedIds = explode(',', $request->deleted_values);
            AttributeValue::whereIn('id', $deletedIds)
                ->where('attribute_id', $attribute->id)
                ->delete();
        }

        // Handle attribute values (both new and existing)
        if ($request->has('value_name') && is_array($request->value_name)) {
            foreach ($request->value_name as $valueId => $valueName) {
                // Check if this is an existing value (numeric ID) or new value (temp- prefix)
                if (is_numeric($valueId)) {
                    // Update existing value
                    $attributeValue = AttributeValue::where('id', $valueId)
                        ->where('attribute_id', $attribute->id)
                        ->first();

                    if ($attributeValue) {
                        $attributeValue->name = $valueName;
                        $attributeValue->slug = Str::slug($valueName);

                        // Update color if it's a color attribute
                        if ($attribute->is_color && isset($request->color[$valueId])) {
                            $attributeValue->color = $request->color[$valueId];
                        } else {
                            $attributeValue->color = null;
                        }

                        $attributeValue->save();
                    }
                } else {
                    // Create new value (starts with 'temp-')
                    $attributeValue = new AttributeValue();
                    $attributeValue->attribute_id = $attribute->id;
                    $attributeValue->name = $valueName;
                    $attributeValue->slug = Str::slug($valueName);

                    // Get the next index
                    $maxIndex = AttributeValue::where('attribute_id', $attribute->id)->max('index') ?? 0;
                    $attributeValue->index = $maxIndex + 1;
                    $attributeValue->status = 'ACTIVE';

                    // Set color if it's a color attribute
                    if ($attribute->is_color && isset($request->color[$valueId])) {
                        $attributeValue->color = $request->color[$valueId];
                    } else {
                        $attributeValue->color = null;
                    }

                    $attributeValue->save();
                }
            }
        }

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute updated successfully.');
    }

    public function destroy(Attribute $attribute)
    {
        $attribute->delete();
        return redirect()->route('admin.attributes.index')->with('success', 'Attribute deleted successfully.');
    }

    public function changeStatus(Request $request): RedirectResponse
    {
        $request->validate([
            'attribute_id' => 'required|integer|exists:attributes,id',
            'status' => 'required|in:ACTIVE,INACTIVE',
        ]);

        $attribute = Attribute::findOrFail($request->attribute_id);
        $attribute->status = $request->status;
        $attribute->save();

        return redirect()->route('admin.attributes.index')->with('success', 'Attribute status updated successfully.');
    }

    /** @var array<string, string> Validation rules */
    private array $rules = [
        'name' => 'required|string|max:100|unique:attributes,name',
        'label' => 'required|string|max:100',
        'is_color' => 'required|in:0,1',
        'value_name' => 'nullable|array',
        'value_name.*' => 'required|string|max:100',
        'color' => 'nullable|array',
        'color.*' => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        'deleted_values' => 'nullable|string',
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
        'value_name.array' => 'Value names must be an array',
        'value_name.*.required' => 'Value name is required',
        'value_name.*.string' => 'Value name must be a string',
        'value_name.*.max' => 'Value name must not exceed 100 characters',
        'color.array' => 'Colors must be an array',
        'color.*.regex' => 'Color must be a valid hex color code (e.g., #FF5733)',
    ];
}
