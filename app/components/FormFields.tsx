import React from 'react';
import type { FormStep } from '../types/document';

interface FormFieldsProps {
  step: FormStep;
  values: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
}

export function FormFields({ step, values, onChange }: FormFieldsProps) {
  const renderField = (field: FormStep['fields'][0]) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={field.id}
            value={values[field.id] || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={field.id}
            value={values[field.id] || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );
      
      case 'list':
        const items = (values[field.id] || []) as string[];
        
        return (
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index] = e.target.value;
                    onChange(field.id, newItems);
                  }}
                  placeholder={field.placeholder}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newItems = items.filter((_, i) => i !== index);
                    onChange(field.id, newItems);
                  }}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange(field.id, [...items, ''])}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Item
            </button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {step.fields.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <div className="mt-1">
            {renderField(field)}
          </div>
          {field.help && (
            <p className="mt-2 text-sm text-gray-500">
              {field.help}
            </p>
          )}
        </div>
      ))}
    </div>
  );
} 