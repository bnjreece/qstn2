import type { FormStep } from "../types/document";

export const formSteps: FormStep[] = [
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