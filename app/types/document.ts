export type DocumentSection = {
  id: string;
  document_id: string;
  section_type: 'vision' | 'mission' | 'goals' | 'objectives' | 'strategy';
  content: Record<string, any>;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Document = {
  id: string;
  user_id: string;
  title: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
  sections?: DocumentSection[];
};

export type FormStep = {
  id: DocumentSection['section_type'];
  title: string;
  description: string;
  fields: {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'list';
    placeholder?: string;
    help?: string;
  }[];
}; 