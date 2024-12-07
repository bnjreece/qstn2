import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useForm } from './FormContext';

interface FormFieldRenderProps {
  value: any;
  onChange: (value: any) => void;
}

interface FormSectionProps {
  children: ReactNode | ((props: FormFieldRenderProps) => ReactNode);
  title: string;
  description?: string;
  sectionId: string;
  tips?: string[];
}

export function FormSection({
  children,
  title,
  description,
  sectionId,
  tips = [
    'Be specific and measurable',
    'Make it personal and meaningful',
    'Think long-term',
  ],
}: FormSectionProps) {
  const { updateFormData, formData } = useForm();
  console.log('FormSection rendering:', { title, description, sectionId, formData });

  return (
    <motion.div
      className="space-y-12 border border-red-500"
    >
      <div className="border border-blue-500">
        Debug: FormSection Header
        {/* Section Header */}
        <div className="space-y-4">
          <h2 className="text-4xl font-light text-gray-900">{title}</h2>
          {description && (
            <p className="text-xl font-light text-gray-600">{description}</p>
          )}
        </div>
      </div>

      {/* Section Content */}
      <div className="py-8 border border-green-500">
        Debug: Before Form Content
        {typeof children === 'function'
          ? children({
              value: formData[sectionId],
              onChange: (value: any) => {
                console.log('FormSection onChange:', value);
                updateFormData(sectionId, value);
              },
            })
          : children}
        Debug: After Form Content
      </div>

      {/* Tips */}
      <div className="mt-12 border border-yellow-500">
        Debug: Tips Section
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tips</h3>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start text-gray-600">
                <span className="mr-2">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

// Helper components for consistent form fields
export function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-lg font-medium text-gray-700">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export function FormDivider() {
  return <hr className="my-8 border-gray-200" />;
} 