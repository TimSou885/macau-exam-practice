DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  id TEXT PRIMARY KEY NOT NULL,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_key TEXT NOT NULL,
  explanation TEXT,
  exam_types TEXT NOT NULL
);

CREATE INDEX idx_questions_category ON questions(category);
