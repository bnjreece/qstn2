import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: (value: string) => Promise<void>;
  label: string;
  placeholder?: string;
  autoFocus?: boolean;
  minRows?: number;
  maxRows?: number;
}

export function TextInput({
  value,
  onChange,
  onSave,
  label,
  placeholder = 'Start typing...',
  autoFocus = false,
  minRows = 3,
  maxRows = 10
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debouncedValue = useDebounce(value, 1000);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minRows * 24), // 24px per row
      maxRows * 24
    );
    textarea.style.height = `${newHeight}px`;
  }, [value, minRows, maxRows]);

  // Autosave when value changes
  useEffect(() => {
    if (!onSave || debouncedValue === value || !value) return;

    const saveValue = async () => {
      setIsSaving(true);
      try {
        await onSave(value);
      } catch (error) {
        console.error('Failed to save:', error);
      } finally {
        setIsSaving(false);
      }
    };

    saveValue();
  }, [debouncedValue, value, onSave]);

  return (
    <div className="relative transition-all duration-300 ease-in-out">
      {/* Label */}
      <label
        className={`absolute left-4 transition-all duration-300 ease-in-out ${
          isFocused || value
            ? '-top-6 text-sm text-indigo-600'
            : 'top-4 text-gray-500'
        }`}
      >
        {label}
      </label>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full p-4 border-2 rounded-lg transition-all duration-300 ease-in-out resize-none
          ${
            isFocused
              ? 'border-indigo-600 shadow-lg shadow-indigo-100'
              : 'border-gray-200'
          }
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
        style={{ minHeight: `${minRows * 24}px` }}
      />

      {/* Save indicator */}
      {onSave && (
        <div
          className={`absolute right-4 bottom-4 transition-opacity duration-300 ${
            isSaving ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-sm text-indigo-600">Saving...</span>
        </div>
      )}
    </div>
  );
} 