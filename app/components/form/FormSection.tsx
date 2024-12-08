import { ReactNode } from 'react';
import { useForm } from './FormContext';

interface FormFieldRenderProps {
  value: string;
  onChange: (value: string) => void;
}

interface FormSectionProps {
  children: (props: FormFieldRenderProps) => ReactNode;
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
  tips = [],
}: FormSectionProps) {
  const { updateFormData, formData } = useForm();

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-light text-dark">{title}</h2>
        {description && (
          <p className="text-xl font-light text-ui-dark/70">{description}</p>
        )}
      </div>

      <div className="py-8">
        {children({
          value: formData[sectionId] || '',
          onChange: (value: string) => updateFormData(sectionId, value),
        })}
      </div>

      {tips.length > 0 && (
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-primary/10">
          <h3 className="text-sm font-medium text-dark mb-3">Tips</h3>
          <ul className="space-y-2">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start text-ui-dark/70">
                <span className="mr-2 text-primary">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
