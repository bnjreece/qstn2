import { supabase } from './supabase';
import type { Database } from '~/types/supabase';
import { sections, type SectionType, type SectionData } from '~/config/form-sections';

type Document = Database['public']['Tables']['documents']['Row'];
type DocumentSection = Database['public']['Tables']['document_sections']['Row'];

export async function createDocument(userId: string, title: string) {
  const { data: document, error } = await supabase
    .from('documents')
    .insert({ user_id: userId, title, is_complete: false })
    .select()
    .single();

  if (error) throw error;
  return document;
}

export async function getDocument(documentId: string) {
  const { data: document, error } = await supabase
    .from('documents')
    .select(`
      *,
      document_sections (
        id,
        document_id,
        section_type,
        content,
        order_index,
        created_at,
        updated_at
      )
    `)
    .eq('id', documentId)
    .single();

  if (error) throw error;
  return document as Document & { document_sections: DocumentSection[] };
}

export async function updateSection<T extends SectionType>(
  documentId: string,
  sectionType: T,
  content: SectionData[T]
) {
  const section = sections.find(s => s.type === sectionType);
  if (!section) throw new Error(`Invalid section type: ${sectionType}`);

  // Validate content against schema
  section.schema.parse(content);

  const { data: existingSection } = await supabase
    .from('document_sections')
    .select()
    .eq('document_id', documentId)
    .eq('section_type', sectionType)
    .single();

  if (existingSection) {
    const { error } = await supabase
      .from('document_sections')
      .update({ content })
      .eq('id', existingSection.id);

    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('document_sections')
      .insert({
        document_id: documentId,
        section_type: sectionType,
        content,
        order_index: section.order,
      });

    if (error) throw error;
  }
}

export async function getSectionContent<T extends SectionType>(
  documentId: string,
  sectionType: T
): Promise<SectionData[T] | null> {
  const { data: section } = await supabase
    .from('document_sections')
    .select('content')
    .eq('document_id', documentId)
    .eq('section_type', sectionType)
    .single();

  return section?.content as SectionData[T] || null;
}

export async function completeDocument(documentId: string) {
  const { error } = await supabase
    .from('documents')
    .update({ is_complete: true })
    .eq('id', documentId);

  if (error) throw error;
}

export async function validateDocument(documentId: string): Promise<boolean> {
  const document = await getDocument(documentId);
  if (!document) return false;

  const sectionMap = new Map(
    document.document_sections.map((section: DocumentSection) => [section.section_type, section])
  );

  // Check if all required sections exist and validate their content
  for (const section of sections) {
    const documentSection = sectionMap.get(section.type);
    if (!documentSection) return false;

    try {
      section.schema.parse(documentSection.content);
    } catch {
      return false;
    }
  }

  return true;
} 