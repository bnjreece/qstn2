import { FormSection, FormField } from '../FormSection';
import { TextInput } from '../TextInput';

interface CoreValues {
  mission: string;
  vision: string;
  values: string[];
}

export function CoreValuesSection() {
  return (
    <FormSection
      title="Personal Values & Purpose"
      description="Define your core values and what matters most to you in life."
      sectionId="core-values"
    >
      {({ value, onChange }: { value: CoreValues, onChange: (value: CoreValues) => void }) => {
        const currentValue = value || { mission: '', vision: '', values: [''] };
        
        return (
          <div className="space-y-8">
            <TextInput
              label="Personal Mission"
              value={currentValue.mission}
              onChange={(mission) => onChange({ ...currentValue, mission })}
              placeholder="What is your purpose in life? What do you want to contribute to the world?"
              minRows={3}
            />

            <TextInput
              label="Personal Vision"
              value={currentValue.vision}
              onChange={(vision) => onChange({ ...currentValue, vision })}
              placeholder="What kind of person do you want to become? Where do you see yourself in the future?"
              minRows={3}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Personal Values</h3>
              <div className="space-y-2">
                {currentValue.values.map((value, index) => (
                  <div key={index} className="flex gap-2">
                    <TextInput
                      label={`Value ${index + 1}`}
                      value={value}
                      onChange={(newValue) => {
                        const newValues = [...currentValue.values];
                        newValues[index] = newValue;
                        onChange({ ...currentValue, values: newValues });
                      }}
                      placeholder="e.g., Integrity, Growth, Family, Health..."
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newValues = currentValue.values.filter((_, i) => i !== index);
                          onChange({ ...currentValue, values: newValues });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  onChange({
                    ...currentValue,
                    values: [...currentValue.values, '']
                  });
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add another value
              </button>
            </div>
          </div>
        );
      }}
    </FormSection>
  );
} 