import { SQLiteDatabase, openDatabaseAsync } from 'expo-sqlite';

let dbPromise: Promise<SQLiteDatabase> | null = null;

async function migrate(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS sources (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      author_or_publisher TEXT,
      source_type TEXT NOT NULL,
      category TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS passages (
      id TEXT PRIMARY KEY NOT NULL,
      source_id TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      page_or_location TEXT,
      chapter_or_section TEXT,
      initial_question TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS explanation_requests (
      id TEXT PRIMARY KEY NOT NULL,
      passage_id TEXT NOT NULL,
      selected_text TEXT NOT NULL,
      mode TEXT NOT NULL,
      custom_question TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (passage_id) REFERENCES passages(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS margin_notes (
      id TEXT PRIMARY KEY NOT NULL,
      source_id TEXT NOT NULL,
      passage_id TEXT NOT NULL,
      explanation_request_id TEXT NOT NULL,
      is_demo_explanation INTEGER NOT NULL,
      plain_english_explanation TEXT NOT NULL,
      missing_background TEXT,
      example_or_analogy TEXT,
      why_it_matters TEXT,
      adaptive_module_title TEXT,
      adaptive_module_content TEXT,
      related_concepts_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      saved_at TEXT,
      FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE,
      FOREIGN KEY (passage_id) REFERENCES passages(id) ON DELETE CASCADE,
      FOREIGN KEY (explanation_request_id) REFERENCES explanation_requests(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS concepts (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      summary TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS margin_note_concepts (
      margin_note_id TEXT NOT NULL,
      concept_id TEXT NOT NULL,
      PRIMARY KEY (margin_note_id, concept_id),
      FOREIGN KEY (margin_note_id) REFERENCES margin_notes(id) ON DELETE CASCADE,
      FOREIGN KEY (concept_id) REFERENCES concepts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS follow_up_questions (
      id TEXT PRIMARY KEY NOT NULL,
      margin_note_id TEXT NOT NULL,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      is_demo_answer INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (margin_note_id) REFERENCES margin_notes(id) ON DELETE CASCADE
    );
  `);
}

export async function getDb() {
  if (!dbPromise) {
    dbPromise = openDatabaseAsync('margin.db').then(async (db) => {
      await migrate(db);
      return db;
    });
  }

  return dbPromise;
}

export async function initializeDatabase() {
  await getDb();
}

export async function clearAllData() {
  const db = await getDb();
  await db.execAsync(`
    DELETE FROM follow_up_questions;
    DELETE FROM margin_note_concepts;
    DELETE FROM concepts;
    DELETE FROM margin_notes;
    DELETE FROM explanation_requests;
    DELETE FROM passages;
    DELETE FROM sources;
  `);
}
