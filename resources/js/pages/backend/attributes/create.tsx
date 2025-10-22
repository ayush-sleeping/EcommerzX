import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { CircleAlert, Plus, Settings2, Tag } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Attributes',
        href: '/admin/attributes',
    },
    {
        title: 'Create New Attribute',
        href: '/admin/attributes/create',
    },
];

interface PageProps {
    [key: string]: unknown;
}

interface AttributeValue {
    id: string;
    name: string;
    color: string;
}

export default function Create() {
    const [attributeValues, setAttributeValues] = useState<AttributeValue[]>([]);
    const [nextValueId, setNextValueId] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, errors } = useForm({
        name: '',
        label: '',
        is_color: '0',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Transform attributeValues to separate arrays (value_name and color)
        const value_name = attributeValues.map((v) => v.name);
        const color = attributeValues.map((v) => v.color);

        // Create form data with separate arrays
        const formData: any = {
            name: data.name,
            label: data.label,
            is_color: data.is_color,
        };

        // Add value_name array if values exist
        if (value_name.length > 0) {
            formData.value_name = value_name;
        }

        // Add color array if it's a color attribute and values exist
        if (data.is_color === '1' && color.length > 0) {
            formData.color = color;
        }

        // Use router.post to send custom data
        router.post(route('admin.attributes.store'), formData, {
            onSuccess: () => {
                setData({
                    name: '',
                    label: '',
                    is_color: '0',
                });
                setAttributeValues([]);
                setNextValueId(1);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const addValue = () => {
        const newValue: AttributeValue = {
            id: `temp-${nextValueId}`,
            name: '',
            color: '#000000',
        };
        setAttributeValues([...attributeValues, newValue]);
        setNextValueId(nextValueId + 1);
    };

    const removeValue = (id: string) => {
        setAttributeValues(attributeValues.filter((v) => v.id !== id));
    };

    const updateValue = (id: string, field: 'name' | 'color', value: string) => {
        setAttributeValues(attributeValues.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Attribute" />

            {/* Header Section */}
            <div className="m-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Create New Attribute</h1>
                            <p className="text-muted-foreground">Add a new product attribute to the system.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Messages */}
            {Object.keys(errors).length > 0 && (
                <div className="mx-4 mb-6">
                    <Alert variant="destructive" className="border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-900/10">
                        <CircleAlert className="h-5 w-5" />
                        <div>
                            <AlertTitle>Validation Errors</AlertTitle>
                            <AlertDescription>
                                <ul className="mt-2 list-inside list-disc space-y-1">
                                    {Object.entries(errors).map(([field, message]) => (
                                        <li key={field}>
                                            <span className="font-medium capitalize">{field.replace('_', ' ')}</span>: {message}
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </div>
                    </Alert>
                </div>
            )}

            {/* Main Form */}
            <div className="mx-4 mb-8">
                <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
                    <div className="grid gap-6">
                        {/* Attribute Information Card */}
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings2 className="h-5 w-5" />
                                    Attribute Information
                                </CardTitle>
                                <CardDescription>Enter the attribute's basic details and configuration.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2 font-medium">
                                        <Tag className="h-4 w-4" />
                                        Name
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g. color, size, material"
                                        className="transition-all"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        The internal name for this attribute (lowercase, no spaces)
                                    </p>
                                    {errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                                </div>

                                {/* Label */}
                                <div className="space-y-2">
                                    <Label htmlFor="label" className="flex items-center gap-2 font-medium">
                                        <Tag className="h-4 w-4" />
                                        Label
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="label"
                                        type="text"
                                        value={data.label}
                                        onChange={(e) => setData('label', e.target.value)}
                                        placeholder="e.g. Color, Size, Material"
                                        className="transition-all"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">The display name shown to users</p>
                                    {errors.label && <p className="text-sm text-red-600 dark:text-red-400">{errors.label}</p>}
                                </div>

                                {/* Is Color */}
                                <div className="space-y-2">
                                    <Label htmlFor="is_color" className="font-medium">
                                        Is Color Attribute?
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select value={data.is_color} onValueChange={(value) => setData('is_color', value)}>
                                        <SelectTrigger className="transition-all">
                                            <SelectValue placeholder="Select option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                                                    No
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="1">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                    Yes
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Select "Yes" if this attribute represents colors (will enable color picker)
                                    </p>
                                    {errors.is_color && <p className="text-sm text-red-600 dark:text-red-400">{errors.is_color}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attribute Values Card - Only show when is_color is selected */}
                        {data.is_color !== '' && (
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <Tag className="h-5 w-5" />
                                                Add Values
                                            </CardTitle>
                                            <CardDescription>
                                                {data.is_color === '1'
                                                    ? 'Add color values with names and color codes (e.g., Red, Blue, Green)'
                                                    : 'Add text values for this attribute (e.g., S, M, L, XL)'}
                                            </CardDescription>
                                        </div>
                                        <Button type="button" onClick={addValue} size="sm" variant="outline">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Value
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {attributeValues.length === 0 ? (
                                        <div className="rounded-lg border border-dashed p-8 text-center">
                                            <Tag className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">No values added yet</h3>
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                Click "Add Value" button to start adding values to this attribute.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {attributeValues.map((value, index) => (
                                                <div
                                                    key={value.id}
                                                    className="rounded-lg border-2 border-blue-500 p-4 transition-all hover:border-blue-600 dark:border-blue-600 dark:hover:border-blue-500"
                                                >
                                                    <div className="flex gap-3">
                                                        {/* Name Input */}
                                                        <div className="flex-1">
                                                            <Input
                                                                id={`value-name-${value.id}`}
                                                                type="text"
                                                                value={value.name}
                                                                onChange={(e) => updateValue(value.id, 'name', e.target.value)}
                                                                placeholder={
                                                                    data.is_color === '1' ? 'e.g. Red, Blue, Green' : 'e.g. Small, Medium, Large'
                                                                }
                                                                className="h-10"
                                                                required
                                                            />
                                                        </div>

                                                        {/* Color Picker - Only show if is_color is Yes */}
                                                        {data.is_color === '1' && (
                                                            <div className="w-32">
                                                                <Input
                                                                    id={`value-color-${value.id}`}
                                                                    type="color"
                                                                    value={value.color || '#000000'}
                                                                    onChange={(e) => updateValue(value.id, 'color', e.target.value)}
                                                                    className="h-10 w-full cursor-pointer"
                                                                    title="Choose color"
                                                                    required
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Remove Button */}
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="icon"
                                                            onClick={() => removeValue(value.id)}
                                                            className="h-10 w-10 shrink-0"
                                                            title="Remove this value"
                                                        >
                                                            <CircleAlert className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="mt-8 flex justify-end gap-4">
                        <Link href={route('admin.attributes.index')}>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                            {isSubmitting ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Attribute
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
