import { z } from 'zod';

// Section Types
export const SectionType = {
  MISSION: 'mission',
  VISION: 'vision',
  VALUES: 'values',
  OBJECTIVES: 'objectives',
  STRATEGIES: 'strategies',
  METRICS: 'metrics',
} as const;

export type SectionType = typeof SectionType[keyof typeof SectionType];

// Base schemas for each section type
const missionSchema = z.object({
  statement: z.string().min(1, 'Mission statement is required'),
  description: z.string().optional(),
});

const visionSchema = z.object({
  statement: z.string().min(1, 'Vision statement is required'),
  timeframe: z.string().optional(),
  description: z.string().optional(),
});

const valueSchema = z.object({
  title: z.string().min(1, 'Value title is required'),
  description: z.string().optional(),
});

const valuesSchema = z.object({
  values: z.array(valueSchema).min(1, 'At least one value is required'),
});

const objectiveSchema = z.object({
  title: z.string().min(1, 'Objective title is required'),
  description: z.string().optional(),
  timeframe: z.string().optional(),
});

const objectivesSchema = z.object({
  objectives: z.array(objectiveSchema).min(1, 'At least one objective is required'),
});

const strategySchema = z.object({
  title: z.string().min(1, 'Strategy title is required'),
  description: z.string().optional(),
  objectiveId: z.string().optional(), // Links to specific objective
});

const strategiesSchema = z.object({
  strategies: z.array(strategySchema).min(1, 'At least one strategy is required'),
});

const metricSchema = z.object({
  title: z.string().min(1, 'Metric title is required'),
  target: z.string().optional(),
  current: z.string().optional(),
  unit: z.string().optional(),
  objectiveId: z.string().optional(), // Links to specific objective
});

const metricsSchema = z.object({
  metrics: z.array(metricSchema).min(1, 'At least one metric is required'),
});

// Section configurations
export const sections = [
  {
    type: SectionType.MISSION,
    title: 'Mission Statement',
    description: 'Define your organization\'s purpose and primary objectives.',
    schema: missionSchema,
    order: 0,
  },
  {
    type: SectionType.VISION,
    title: 'Vision Statement',
    description: 'Describe your organization\'s aspirations and desired future state.',
    schema: visionSchema,
    order: 1,
  },
  {
    type: SectionType.VALUES,
    title: 'Core Values',
    description: 'List the fundamental beliefs that guide your organization.',
    schema: valuesSchema,
    order: 2,
  },
  {
    type: SectionType.OBJECTIVES,
    title: 'Strategic Objectives',
    description: 'Define your key organizational goals.',
    schema: objectivesSchema,
    order: 3,
  },
  {
    type: SectionType.STRATEGIES,
    title: 'Strategies',
    description: 'Outline how you will achieve your objectives.',
    schema: strategiesSchema,
    order: 4,
  },
  {
    type: SectionType.METRICS,
    title: 'Key Metrics',
    description: 'Define how you will measure success.',
    schema: metricsSchema,
    order: 5,
  },
] as const;

// Helper types
export type Section = typeof sections[number];
export type SectionData = {
  [SectionType.MISSION]: z.infer<typeof missionSchema>;
  [SectionType.VISION]: z.infer<typeof visionSchema>;
  [SectionType.VALUES]: z.infer<typeof valuesSchema>;
  [SectionType.OBJECTIVES]: z.infer<typeof objectivesSchema>;
  [SectionType.STRATEGIES]: z.infer<typeof strategiesSchema>;
  [SectionType.METRICS]: z.infer<typeof metricsSchema>;
}; 