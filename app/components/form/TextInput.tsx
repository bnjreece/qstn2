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
  placeholder = 'Click here and start typing...',
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
      Math.max(textarea.scrollHeight, minRows * 28), // Increased line height
      maxRows * 28
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

  // Focus the textarea on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="relative">
      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full bg-transparent text-2xl font-light border-b-2 p-0 pb-2 resize-none
            ${
              isFocused
                ? 'border-indigo-600'
                : 'border-gray-200 hover:border-gray-300'
            }
            focus:outline-none focus:ring-0 transition-colors`}
          style={{ minHeight: `${minRows * 28}px`, lineHeight: '1.4' }}
        />
        
        {/* Placeholder text when empty */}
        {!value && !isFocused && (
          <div className="absolute inset-0 pointer-events-none">
            <span className="text-2xl font-light text-gray-400">
              {placeholder}
            </span>
          </div>
        )}
      </div>

      {/* Save indicator */}
      {onSave && isSaving && (
        <div className="absolute right-0 bottom-0 text-sm text-indigo-600">
          Saving...
        </div>
      )}
    </div>
  );
} 