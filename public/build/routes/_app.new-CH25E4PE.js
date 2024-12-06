import {
  require_auth,
  require_supabase
} from "/build/_shared/chunk-BPG23C7F.js";
import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  useActionData,
  useLoaderData,
  useSubmit
} from "/build/_shared/chunk-S4DVDOAZ.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  createHotContext
} from "/build/_shared/chunk-LYDTJ3QQ.js";
import "/build/_shared/chunk-UWV35TSL.js";
import {
  require_react
} from "/build/_shared/chunk-7M6SC7J5.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/_app.new.tsx
var import_react = __toESM(require_react(), 1);
var import_node = __toESM(require_node(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_supabase = __toESM(require_supabase(), 1);

// app/config/form-steps.ts
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/config/form-steps.ts"
  );
  import.meta.hot.lastModified = "1733455539400.0432";
}
var formSteps = [
  {
    id: "vision",
    title: "Vision Statement",
    description: "Define where your organization wants to be in the future",
    fields: [
      {
        id: "statement",
        label: "Vision Statement",
        type: "textarea",
        placeholder: "In 5-10 years, our organization will...",
        help: "A vision statement describes the desired future position of your organization"
      }
    ]
  },
  {
    id: "mission",
    title: "Mission Statement",
    description: "Define your organization's purpose and primary objectives",
    fields: [
      {
        id: "statement",
        label: "Mission Statement",
        type: "textarea",
        placeholder: "Our mission is to...",
        help: "A mission statement describes why your organization exists and what it does"
      }
    ]
  },
  {
    id: "goals",
    title: "Strategic Goals",
    description: "Define your major goals for the next 1-3 years",
    fields: [
      {
        id: "goals",
        label: "Strategic Goals",
        type: "list",
        placeholder: "Enter a strategic goal",
        help: "List 3-5 major goals that will help achieve your vision"
      }
    ]
  },
  {
    id: "objectives",
    title: "Key Objectives",
    description: "Define specific, measurable objectives for each goal",
    fields: [
      {
        id: "objectives",
        label: "Key Objectives",
        type: "list",
        placeholder: "Enter a SMART objective",
        help: "Create SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound)"
      }
    ]
  },
  {
    id: "strategy",
    title: "Action Strategy",
    description: "Define how you will achieve your objectives",
    fields: [
      {
        id: "strategies",
        label: "Strategic Actions",
        type: "list",
        placeholder: "Enter a strategic action",
        help: "List specific actions that will help achieve your objectives"
      }
    ]
  }
];

// app/components/FormStepper.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/FormStepper.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/FormStepper.tsx"
  );
  import.meta.hot.lastModified = "1733455549112.2156";
}
function FormStepper({
  steps,
  currentStep,
  onStepClick
}) {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("nav", { "aria-label": "Progress", className: "mb-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("ol", { role: "list", className: "space-y-4 md:flex md:space-y-0 md:space-x-8", children: steps.map((step, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("li", { className: "md:flex-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => onStepClick(index), className: `group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 ${index === currentStep ? "border-indigo-600" : index < currentStep ? "border-green-600" : "border-gray-200"}`, children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-medium", children: [
      "Step ",
      index + 1
    ] }, void 0, true, {
      fileName: "app/components/FormStepper.tsx",
      lineNumber: 31,
      columnNumber: 15
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm", children: step.title }, void 0, false, {
      fileName: "app/components/FormStepper.tsx",
      lineNumber: 34,
      columnNumber: 15
    }, this)
  ] }, void 0, true, {
    fileName: "app/components/FormStepper.tsx",
    lineNumber: 30,
    columnNumber: 13
  }, this) }, step.id, false, {
    fileName: "app/components/FormStepper.tsx",
    lineNumber: 29,
    columnNumber: 37
  }, this)) }, void 0, false, {
    fileName: "app/components/FormStepper.tsx",
    lineNumber: 28,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/components/FormStepper.tsx",
    lineNumber: 27,
    columnNumber: 10
  }, this);
}
_c = FormStepper;
var _c;
$RefreshReg$(_c, "FormStepper");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/components/FormFields.tsx
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/components/FormFields.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/components/FormFields.tsx"
  );
  import.meta.hot.lastModified = "1733455578374.5222";
}
function FormFields({
  step,
  values,
  onChange
}) {
  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "text", id: field.id, value: values[field.id] || "", onChange: (e) => onChange(field.id, e.target.value), placeholder: field.placeholder, className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" }, void 0, false, {
          fileName: "app/components/FormFields.tsx",
          lineNumber: 30,
          columnNumber: 16
        }, this);
      case "textarea":
        return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("textarea", { id: field.id, value: values[field.id] || "", onChange: (e) => onChange(field.id, e.target.value), placeholder: field.placeholder, rows: 4, className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" }, void 0, false, {
          fileName: "app/components/FormFields.tsx",
          lineNumber: 32,
          columnNumber: 16
        }, this);
      case "list":
        const items = values[field.id] || [];
        return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "space-y-2", children: [
          items.map((item, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("input", { type: "text", value: item, onChange: (e) => {
              const newItems = [...items];
              newItems[index] = e.target.value;
              onChange(field.id, newItems);
            }, placeholder: field.placeholder, className: "block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" }, void 0, false, {
              fileName: "app/components/FormFields.tsx",
              lineNumber: 37,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "button", onClick: () => {
              const newItems = items.filter((_, i) => i !== index);
              onChange(field.id, newItems);
            }, className: "inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", children: "Remove" }, void 0, false, {
              fileName: "app/components/FormFields.tsx",
              lineNumber: 42,
              columnNumber: 17
            }, this)
          ] }, index, true, {
            fileName: "app/components/FormFields.tsx",
            lineNumber: 36,
            columnNumber: 41
          }, this)),
          /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("button", { type: "button", onClick: () => onChange(field.id, [...items, ""]), className: "inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", children: "Add Item" }, void 0, false, {
            fileName: "app/components/FormFields.tsx",
            lineNumber: 49,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/components/FormFields.tsx",
          lineNumber: 35,
          columnNumber: 16
        }, this);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "space-y-6", children: step.fields.map((field) => /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("label", { htmlFor: field.id, className: "block text-sm font-medium text-gray-700", children: field.label }, void 0, false, {
      fileName: "app/components/FormFields.tsx",
      lineNumber: 57,
      columnNumber: 11
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "mt-1", children: renderField(field) }, void 0, false, {
      fileName: "app/components/FormFields.tsx",
      lineNumber: 60,
      columnNumber: 11
    }, this),
    field.help && /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("p", { className: "mt-2 text-sm text-gray-500", children: field.help }, void 0, false, {
      fileName: "app/components/FormFields.tsx",
      lineNumber: 63,
      columnNumber: 26
    }, this)
  ] }, field.id, true, {
    fileName: "app/components/FormFields.tsx",
    lineNumber: 56,
    columnNumber: 33
  }, this)) }, void 0, false, {
    fileName: "app/components/FormFields.tsx",
    lineNumber: 55,
    columnNumber: 10
  }, this);
}
_c2 = FormFields;
var _c2;
$RefreshReg$(_c2, "FormFields");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

// app/routes/_app.new.tsx
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app/routes/_app.new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app/routes/_app.new.tsx"
  );
  import.meta.hot.lastModified = "1733455676586.0352";
}
function isErrorResponse(data) {
  return "error" in data;
}
function NewDocument() {
  _s();
  const {
    document,
    sections
  } = useLoaderData();
  const [currentStep, setCurrentStep] = (0, import_react.useState)(0);
  const [values, setValues] = (0, import_react.useState)({});
  const submit = useSubmit();
  const actionData = useActionData();
  (0, import_react.useEffect)(() => {
    if (sections) {
      const initialValues = sections.reduce((acc, section) => ({
        ...acc,
        [section.section_type]: section.content
      }), {});
      setValues(initialValues);
    }
  }, [sections]);
  (0, import_react.useEffect)(() => {
    if (document && sections) {
      const currentSection = sections[currentStep];
      const formData = new FormData();
      formData.append("documentId", document.id);
      formData.append("sectionType", currentSection.section_type);
      formData.append("content", JSON.stringify(values[currentSection.section_type] || {}));
      const timer = setTimeout(() => {
        submit(formData, {
          method: "post"
        });
      }, 1e3);
      return () => clearTimeout(timer);
    }
  }, [values, currentStep, document, sections, submit]);
  const handleFieldChange = (fieldId, value) => {
    const currentSection = sections[currentStep];
    setValues((prev) => ({
      ...prev,
      [currentSection.section_type]: {
        ...prev[currentSection.section_type],
        [fieldId]: value
      }
    }));
  };
  if (!document || !sections) {
    return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { children: "Loading..." }, void 0, false, {
      fileName: "app/routes/_app.new.tsx",
      lineNumber: 162,
      columnNumber: 12
    }, this);
  }
  const currentStepData = formSteps[currentStep];
  const currentSectionValues = values[sections[currentStep].section_type] || {};
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "max-w-3xl mx-auto", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(FormStepper, { steps: formSteps, currentStep, onStepClick: setCurrentStep }, void 0, false, {
      fileName: "app/routes/_app.new.tsx",
      lineNumber: 167,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "bg-white shadow sm:rounded-lg", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "px-4 py-5 sm:p-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("h3", { className: "text-lg font-medium leading-6 text-gray-900", children: currentStepData.title }, void 0, false, {
        fileName: "app/routes/_app.new.tsx",
        lineNumber: 171,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { className: "mt-1 text-sm text-gray-500", children: currentStepData.description }, void 0, false, {
        fileName: "app/routes/_app.new.tsx",
        lineNumber: 174,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "mt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(FormFields, { step: currentStepData, values: currentSectionValues, onChange: handleFieldChange }, void 0, false, {
        fileName: "app/routes/_app.new.tsx",
        lineNumber: 179,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/_app.new.tsx",
        lineNumber: 178,
        columnNumber: 11
      }, this),
      actionData && isErrorResponse(actionData) && /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("p", { className: "mt-2 text-sm text-red-600", children: actionData.error }, void 0, false, {
        fileName: "app/routes/_app.new.tsx",
        lineNumber: 182,
        columnNumber: 57
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_app.new.tsx",
      lineNumber: 170,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/_app.new.tsx",
      lineNumber: 169,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "mt-4 flex justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("button", { type: "button", onClick: () => setCurrentStep((prev) => Math.max(0, prev - 1)), disabled: currentStep === 0, className: "inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50", children: "Previous" }, void 0, false, {
        fileName: "app/routes/_app.new.tsx",
        lineNumber: 189,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("button", { type: "button", onClick: () => setCurrentStep((prev) => Math.min(formSteps.length - 1, prev + 1)), disabled: currentStep === formSteps.length - 1, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50", children: "Next" }, void 0, false, {
        fileName: "app/routes/_app.new.tsx",
        lineNumber: 192,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/_app.new.tsx",
      lineNumber: 188,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/_app.new.tsx",
    lineNumber: 166,
    columnNumber: 10
  }, this);
}
_s(NewDocument, "O5e6DTtjsJoZHqvQHmr5TV3Hwh0=", false, function() {
  return [useLoaderData, useSubmit, useActionData];
});
_c3 = NewDocument;
var _c3;
$RefreshReg$(_c3, "NewDocument");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  NewDocument as default
};
//# sourceMappingURL=/build/routes/_app.new-CH25E4PE.js.map
