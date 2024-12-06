import React, { useEffect, useState } from 'react';
import { json, redirect } from '@remix-run/node';
import type { DataFunctionArgs } from '@remix-run/node';
import { useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { requireUserId } from '../utils/auth.server';
import { supabase } from '../utils/supabase.server';
import { formSteps } from '../config/form-steps';
import { FormStepper } from '../components/FormStepper';
import { FormFields } from '../components/FormFields';
import type { Document, DocumentSection } from '../types/document';

type ActionData = 
  | { success: true }
  | { error: string };

function isErrorResponse(data: ActionData): data is { error: string } {
  return 'error' in data;
}

export async function loader({ request }: DataFunctionArgs) {
  const userId = await requireUserId(request);
  
  // Create a new document if one doesn't exist
  const { data: existingDocs } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .eq('is_complete', false)
    .order('created_at', { ascending: false })
    .limit(1);

  let document: Document;

  if (!existingDocs || existingDocs.length === 0) {
    const { data: newDoc } = await supabase
      .from('documents')
      .insert([
        {
          user_id: userId,
          title: 'My Strategic Plan',
          is_complete: false,
        },
      ])
      .select()
      .single();

    if (!newDoc) {
      throw new Error('Failed to create document');
    }

    document = newDoc;

    // Create initial sections
    await supabase.from('document_sections').insert(
      formSteps.map((step, index) => ({
        document_id: document.id,
        section_type: step.id,
        content: {},
        order_index: index,
      }))
    );
  } else {
    document = existingDocs[0];
  }

  // Load sections
  const { data: sections } = await supabase
    .from('document_sections')
    .select('*')
    .eq('document_id', document.id)
    .order('order_index', { ascending: true });

  return json({ document, sections });
}

export async function action({ request }: DataFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const documentId = formData.get('documentId');
  const sectionType = formData.get('sectionType');
  const content = JSON.parse(formData.get('content') as string);

  if (!documentId || !sectionType) {
    return json<ActionData>({ error: 'Missing required fields' }, { status: 400 });
  }

  // Update section content
  const { error } = await supabase
    .from('document_sections')
    .update({ content })
    .eq('document_id', documentId)
    .eq('section_type', sectionType);

  if (error) {
    return json<ActionData>({ error: 'Failed to save changes' }, { status: 500 });
  }

  return json<ActionData>({ success: true });
}

export default function NewDocument() {
  const { document, sections } = useLoaderData<typeof loader>();
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Record<string, any>>({});
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  // Load initial values
  useEffect(() => {
    if (sections) {
      const initialValues = sections.reduce((acc, section) => ({
        ...acc,
        [section.section_type]: section.content,
      }), {});
      setValues(initialValues);
    }
  }, [sections]);

  // Auto-save when values change
  useEffect(() => {
    if (document && sections) {
      const currentSection = sections[currentStep];
      const formData = new FormData();
      formData.append('documentId', document.id);
      formData.append('sectionType', currentSection.section_type);
      formData.append('content', JSON.stringify(values[currentSection.section_type] || {}));
      
      const timer = setTimeout(() => {
        submit(formData, { method: 'post' });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [values, currentStep, document, sections, submit]);

  const handleFieldChange = (fieldId: string, value: any) => {
    const currentSection = sections[currentStep];
    setValues(prev => ({
      ...prev,
      [currentSection.section_type]: {
        ...prev[currentSection.section_type],
        [fieldId]: value,
      },
    }));
  };

  if (!document || !sections) {
    return <div>Loading...</div>;
  }

  const currentStepData = formSteps[currentStep];
  const currentSectionValues = values[sections[currentStep].section_type] || {};

  return (
    <div className="max-w-3xl mx-auto">
      <FormStepper
        steps={formSteps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {currentStepData.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {currentStepData.description}
          </p>

          <div className="mt-6">
            <FormFields
              step={currentStepData}
              values={currentSectionValues}
              onChange={handleFieldChange}
            />
          </div>

          {actionData && isErrorResponse(actionData) && (
            <p className="mt-2 text-sm text-red-600">
              {actionData.error}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
          disabled={currentStep === 0}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(prev => Math.min(formSteps.length - 1, prev + 1))}
          disabled={currentStep === formSteps.length - 1}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
} 