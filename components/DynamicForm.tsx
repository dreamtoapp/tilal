'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Field {
    name: string;
    type: string;
    placeholder: string;
    register: any;
    error?: string;
    className?: string;
    options?: Array<{ value: string; label: string }>;
}

interface DynamicFormProps {
    fields: Field[];
}

export default function DynamicForm({ fields }: DynamicFormProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
                <div key={field.name} className={field.className || ''}>
                    <Label htmlFor={field.name} className="text-sm font-medium">
                        {field.placeholder}
                    </Label>

                    {field.type === 'textarea' ? (
                        <Textarea
                            id={field.name}
                            placeholder={field.placeholder}
                            {...field.register}
                            className="mt-1"
                        />
                    ) : field.type === 'select' ? (
                        <Select onValueChange={field.register.onChange} defaultValue={field.register.value}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder={field.placeholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ) : (
                        <Input
                            id={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            {...field.register}
                            className="mt-1"
                        />
                    )}

                    {field.error && (
                        <p className="text-sm text-red-600 mt-1">{field.error}</p>
                    )}
                </div>
            ))}
        </div>
    );
} 