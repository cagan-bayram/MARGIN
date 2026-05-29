import { getDb } from '@/src/db/client';
import {
  explanationRequestSchema,
  followUpQuestionSchema,
  marginNoteSchema,
  newExplanationRequestInputSchema,
  newPassageInputSchema,
  newSourceInputSchema,
  passageSchema,
  sourceSchema,
} from '@/src/schemas/domain';
import type { Concept, ExplanationRequest, FollowUpQuestion, MarginNote, Passage, Source } from '@/src/types/domain';
import { createId, nowIso } from '@/src/utils/id';

type SourceWithCount = Source & { marginNoteCount: number };

type MarginNoteWithContext = MarginNote & {
  sourceTitle: string;
  sourceCategory: Source['category'];
  selectedText: string;
  mode: ExplanationRequest['mode'];
  passageExcerpt: string;
};

function normalize(value: string | null): string | undefined {
  return value ?? undefined;
}

export async function createSource(input: Omit<Source, 'id' | 'createdAt' | 'updatedAt'>): Promise<Source> {
  const parsed = newSourceInputSchema.parse(input);
  const source: Source = {
    ...parsed,
    id: createId('src'),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO sources (id, title, author_or_publisher, source_type, category, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)` ,
    source.id,
    source.title,
    source.authorOrPublisher ?? null,
    source.sourceType,
    source.category,
    source.notes ?? null,
    source.createdAt,
    source.updatedAt,
  );
  return source;
}

export async function listSources(): Promise<SourceWithCount[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{
    id: string;
    title: string;
    author_or_publisher: string | null;
    source_type: Source['sourceType'];
    category: Source['category'];
    notes: string | null;
    created_at: string;
    updated_at: string;
    margin_note_count: number;
  }>(
    `SELECT s.*, COUNT(m.id) as margin_note_count
     FROM sources s
     LEFT JOIN margin_notes m ON m.source_id = s.id
     GROUP BY s.id
     ORDER BY s.updated_at DESC`,
  );

  return rows.map((row) => ({
    ...sourceSchema.parse({
      id: row.id,
      title: row.title,
      authorOrPublisher: normalize(row.author_or_publisher),
      sourceType: row.source_type,
      category: row.category,
      notes: normalize(row.notes),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }),
    marginNoteCount: row.margin_note_count,
  }));
}

export async function getSourceById(sourceId: string): Promise<Source | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    id: string;
    title: string;
    author_or_publisher: string | null;
    source_type: Source['sourceType'];
    category: Source['category'];
    notes: string | null;
    created_at: string;
    updated_at: string;
  }>('SELECT * FROM sources WHERE id = ?', sourceId);

  if (!row) {
    return null;
  }

  return sourceSchema.parse({
    id: row.id,
    title: row.title,
    authorOrPublisher: normalize(row.author_or_publisher),
    sourceType: row.source_type,
    category: row.category,
    notes: normalize(row.notes),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  });
}

export async function createPassage(input: Omit<Passage, 'id' | 'createdAt'>): Promise<Passage> {
  const parsed = newPassageInputSchema.parse(input);
  const passage: Passage = { ...parsed, id: createId('psg'), createdAt: nowIso() };
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO passages (id, source_id, excerpt, page_or_location, chapter_or_section, initial_question, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    passage.id,
    passage.sourceId,
    passage.excerpt,
    passage.pageOrLocation ?? null,
    passage.chapterOrSection ?? null,
    passage.initialQuestion ?? null,
    passage.createdAt,
  );
  return passage;
}

export async function getPassageById(passageId: string): Promise<Passage | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{
    id: string;
    source_id: string;
    excerpt: string;
    page_or_location: string | null;
    chapter_or_section: string | null;
    initial_question: string | null;
    created_at: string;
  }>('SELECT * FROM passages WHERE id = ?', passageId);

  if (!row) {
    return null;
  }

  return passageSchema.parse({
    id: row.id,
    sourceId: row.source_id,
    excerpt: row.excerpt,
    pageOrLocation: normalize(row.page_or_location),
    chapterOrSection: normalize(row.chapter_or_section),
    initialQuestion: normalize(row.initial_question),
    createdAt: row.created_at,
  });
}

export async function createExplanationRequest(input: Omit<ExplanationRequest, 'id' | 'createdAt'>): Promise<ExplanationRequest> {
  const parsed = newExplanationRequestInputSchema.parse(input);
  const request: ExplanationRequest = { ...parsed, id: createId('req'), createdAt: nowIso() };
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO explanation_requests (id, passage_id, selected_text, mode, custom_question, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    request.id,
    request.passageId,
    request.selectedText,
    request.mode,
    request.customQuestion ?? null,
    request.createdAt,
  );
  return explanationRequestSchema.parse(request);
}

export async function saveMarginNote(input: Omit<MarginNote, 'id' | 'createdAt'>): Promise<MarginNote> {
  const note: MarginNote = {
    ...input,
    id: createId('note'),
    createdAt: nowIso(),
  };
  const parsed = marginNoteSchema.parse(note);
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO margin_notes (
      id, source_id, passage_id, explanation_request_id, is_demo_explanation, plain_english_explanation,
      missing_background, example_or_analogy, why_it_matters, adaptive_module_title, adaptive_module_content,
      related_concepts_json, created_at, saved_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    parsed.id,
    parsed.sourceId,
    parsed.passageId,
    parsed.explanationRequestId,
    parsed.isDemoExplanation ? 1 : 0,
    parsed.plainEnglishExplanation,
    parsed.missingBackground ?? null,
    parsed.exampleOrAnalogy ?? null,
    parsed.whyItMatters ?? null,
    parsed.adaptiveModuleTitle ?? null,
    parsed.adaptiveModuleContent ?? null,
    JSON.stringify(parsed.relatedConcepts),
    parsed.createdAt,
    parsed.savedAt ?? null,
  );

  for (const conceptName of parsed.relatedConcepts) {
    const existing = await db.getFirstAsync<{ id: string }>('SELECT id FROM concepts WHERE lower(name)=lower(?)', conceptName);
    const conceptId = existing?.id ?? createId('concept');
    if (!existing) {
      await db.runAsync(
        'INSERT INTO concepts (id, name, type, summary, created_at) VALUES (?, ?, ?, ?, ?)',
        conceptId,
        conceptName,
        'term',
        `Demo concept extracted from margin notes: ${conceptName}`,
        nowIso(),
      );
    }
    await db.runAsync(
      'INSERT OR IGNORE INTO margin_note_concepts (margin_note_id, concept_id) VALUES (?, ?)',
      parsed.id,
      conceptId,
    );
  }

  return parsed;
}

function mapMarginNoteRow(row: {
  id: string;
  source_id: string;
  passage_id: string;
  explanation_request_id: string;
  is_demo_explanation: number;
  plain_english_explanation: string;
  missing_background: string | null;
  example_or_analogy: string | null;
  why_it_matters: string | null;
  adaptive_module_title: string | null;
  adaptive_module_content: string | null;
  related_concepts_json: string;
  created_at: string;
  saved_at: string | null;
}): MarginNote {
  return marginNoteSchema.parse({
    id: row.id,
    sourceId: row.source_id,
    passageId: row.passage_id,
    explanationRequestId: row.explanation_request_id,
    isDemoExplanation: Boolean(row.is_demo_explanation),
    plainEnglishExplanation: row.plain_english_explanation,
    missingBackground: normalize(row.missing_background),
    exampleOrAnalogy: normalize(row.example_or_analogy),
    whyItMatters: normalize(row.why_it_matters),
    adaptiveModuleTitle: normalize(row.adaptive_module_title),
    adaptiveModuleContent: normalize(row.adaptive_module_content),
    relatedConcepts: JSON.parse(row.related_concepts_json) as string[],
    createdAt: row.created_at,
    savedAt: normalize(row.saved_at),
  });
}

export async function listMarginNotesBySource(sourceId: string): Promise<MarginNote[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>('SELECT * FROM margin_notes WHERE source_id = ? ORDER BY created_at DESC', sourceId);
  return rows.map(mapMarginNoteRow);
}

export async function listMarginNotes(): Promise<MarginNoteWithContext[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT m.*, s.title as source_title, s.category as source_category, p.excerpt as passage_excerpt,
            r.selected_text as selected_text, r.mode as mode
     FROM margin_notes m
     JOIN sources s ON s.id = m.source_id
     JOIN passages p ON p.id = m.passage_id
     JOIN explanation_requests r ON r.id = m.explanation_request_id
     ORDER BY m.created_at DESC`,
  );

  return rows.map((row) => ({
    ...mapMarginNoteRow(row),
    sourceTitle: row.source_title,
    sourceCategory: row.source_category,
    selectedText: row.selected_text,
    mode: row.mode,
    passageExcerpt: row.passage_excerpt,
  }));
}

export async function getMarginNoteDetail(noteId: string): Promise<
  | {
      note: MarginNote;
      source: Source;
      passage: Passage;
      request: ExplanationRequest;
      followUps: FollowUpQuestion[];
    }
  | null
> {
  const db = await getDb();
  const noteRow = await db.getFirstAsync<any>('SELECT * FROM margin_notes WHERE id = ?', noteId);
  if (!noteRow) {
    return null;
  }

  const note = mapMarginNoteRow(noteRow);
  const source = await getSourceById(note.sourceId);
  const passage = await getPassageById(note.passageId);

  const reqRow = await db.getFirstAsync<any>('SELECT * FROM explanation_requests WHERE id = ?', note.explanationRequestId);
  if (!source || !passage || !reqRow) {
    return null;
  }

  const request = explanationRequestSchema.parse({
    id: reqRow.id,
    passageId: reqRow.passage_id,
    selectedText: reqRow.selected_text,
    mode: reqRow.mode,
    customQuestion: normalize(reqRow.custom_question),
    createdAt: reqRow.created_at,
  });

  const followUpRows = await db.getAllAsync<any>('SELECT * FROM follow_up_questions WHERE margin_note_id = ? ORDER BY created_at DESC', noteId);
  const followUps = followUpRows.map((row: any) =>
    followUpQuestionSchema.parse({
      id: row.id,
      marginNoteId: row.margin_note_id,
      question: row.question,
      answer: row.answer,
      isDemoAnswer: Boolean(row.is_demo_answer),
      createdAt: row.created_at,
    }),
  );

  return { note, source, passage, request, followUps };
}

export async function createFollowUpQuestion(input: Omit<FollowUpQuestion, 'id' | 'createdAt'>): Promise<FollowUpQuestion> {
  const followUp: FollowUpQuestion = {
    ...input,
    id: createId('fup'),
    createdAt: nowIso(),
  };
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO follow_up_questions (id, margin_note_id, question, answer, is_demo_answer, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    followUp.id,
    followUp.marginNoteId,
    followUp.question,
    followUp.answer,
    followUp.isDemoAnswer ? 1 : 0,
    followUp.createdAt,
  );
  return followUpQuestionSchema.parse(followUp);
}

export async function listConcepts() {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT c.*, COUNT(mnc.margin_note_id) as note_count
     FROM concepts c
     LEFT JOIN margin_note_concepts mnc ON mnc.concept_id = c.id
     GROUP BY c.id
     ORDER BY note_count DESC, c.name ASC`,
  );

  return rows as (Concept & { note_count: number })[];
}

export async function listNotesByConcept(conceptId: string) {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT m.id, m.plain_english_explanation, r.selected_text, s.title as source_title
     FROM margin_note_concepts mnc
     JOIN margin_notes m ON m.id = mnc.margin_note_id
     JOIN explanation_requests r ON r.id = m.explanation_request_id
     JOIN sources s ON s.id = m.source_id
     WHERE mnc.concept_id = ?
     ORDER BY m.created_at DESC`,
    conceptId,
  );
  return rows;
}
