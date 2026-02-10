"use client";

import { useEffect, useMemo, useState } from "react";
import { NoteForm, type NoteDraft } from "./components/NoteForm";
import { NoteList } from "./components/NoteList";
import { TagFilter } from "./components/TagFilter";

const LOCAL_STORAGE_KEY = "agentic-mobile-notes:v1";

export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(() => readNotesFromStorage());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const editingNote = useMemo(
    () => notes.find((note) => note.id === editingNoteId) ?? null,
    [notes, editingNoteId],
  );

  const allTags = useMemo(() => {
    const bucket = new Set<string>();
    for (const note of notes) {
      note.tags.forEach((tag) => bucket.add(tag));
    }
    return Array.from(bucket).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return notes
      .filter((note) => {
        if (selectedTags.length > 0) {
          const hasAllSelected = selectedTags.every((tag) => note.tags.includes(tag));
          if (!hasAllSelected) {
            return false;
          }
        }

        if (!term) {
          return true;
        }

        return (
          note.title.toLowerCase().includes(term) ||
          note.content.toLowerCase().includes(term) ||
          note.tags.some((tag) => tag.toLowerCase().includes(term))
        );
      })
      .sort(sortByUpdatedAtDesc);
  }, [notes, searchTerm, selectedTags]);

  const handleCreateOrUpdate = (draft: NoteDraft) => {
    const normalizedDraft = {
      ...draft,
      tags: Array.from(new Set(draft.tags.map(normalizeTag))),
    };

    if (editingNote) {
      setNotes((prev) =>
        prev
          .map((note) =>
            note.id === editingNote.id
              ? {
                  ...note,
                  ...normalizedDraft,
                  updatedAt: new Date().toISOString(),
                }
              : note,
          )
          .sort(sortByUpdatedAtDesc),
      );
      setEditingNoteId(null);
      return;
    }

    const now = new Date().toISOString();
    const newNote: Note = {
      id: createNoteId(),
      title: normalizedDraft.title || "Untitled",
      content: normalizedDraft.content,
      tags: normalizedDraft.tags,
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prev) => [newNote, ...prev].sort(sortByUpdatedAtDesc));
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (editingNoteId === id) {
      setEditingNoteId(null);
    }
  };

  const activeFilters = selectedTags.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#04030f] via-[#0b1120] to-[#04030f] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-300/70">
              Atlas Notes
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-relaxed sm:text-4xl">
              Capture ideas instantly, organize with smart tags, and search across everything.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base">
              Your notes sync locally to your device. Perfect for mobile jotting with powerful
              filtering when you need to revisit the details.
            </p>
          </div>
          <div className="flex flex-col gap-3 rounded-3xl border border-neutral-800 bg-black/60 p-4 shadow-lg shadow-blue-900/30 backdrop-blur">
            <label htmlFor="search" className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Quick search
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-950 px-4 py-3">
              <svg
                className="h-4 w-4 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                id="search"
                className="flex-1 bg-transparent text-sm text-neutral-100 outline-none placeholder:text-neutral-500"
                placeholder="Search by title, content, or tags"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              {searchTerm && (
                <button
                  className="rounded-full border border-neutral-700 px-3 py-1 text-xs font-semibold text-neutral-300 transition hover:border-blue-400 hover:text-blue-200"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs uppercase tracking-wide text-neutral-500">
                  {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"} visible
                </span>
                {activeFilters > 0 && (
                  <span className="ml-3 rounded-full bg-purple-500/10 px-2 py-1 text-[11px] font-semibold text-purple-200">
                    {activeFilters} {activeFilters === 1 ? "tag" : "tags"} active
                  </span>
                )}
              </div>
              <TagFilter tags={allTags} selected={selectedTags} onChange={setSelectedTags} />
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
          <div className="order-last xl:order-first">
            <NoteForm
              key={editingNote?.id ?? "new"}
              onSubmit={handleCreateOrUpdate}
              editing={Boolean(editingNote)}
              initialValue={
                editingNote
                  ? {
                      title: editingNote.title,
                      content: editingNote.content,
                      tags: editingNote.tags,
                    }
                  : undefined
              }
              onCancelEdit={() => setEditingNoteId(null)}
            />
          </div>
          <div className="order-first xl:order-last">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                Recent notes
              </p>
              {notes.length > 0 && (
                <button
                  onClick={() => setNotes((prev) => prev.sort(sortByUpdatedAtDesc))}
                  className="rounded-full border border-neutral-700 px-3 py-1 text-xs font-semibold text-neutral-300 transition hover:border-blue-400 hover:text-blue-200"
                >
                  Refresh sort
                </button>
              )}
            </div>
            <NoteList
              notes={filteredNotes}
              searchTerm={searchTerm}
              onEdit={(note) => setEditingNoteId(note.id)}
              onDelete={handleDelete}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function normalizeTag(tag: string) {
  return tag.trim().replace(/\s+/g, "-").toLowerCase();
}

function createNoteId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `note-${Math.random().toString(16).slice(2)}`;
}

function sortByUpdatedAtDesc(a: Note, b: Note) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

function readNotesFromStorage(): Note[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedNotes = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!storedNotes) {
      return [];
    }

    const parsed: Note[] = JSON.parse(storedNotes);
    return parsed
      .map((note) => ({
        ...note,
        tags: Array.from(new Set((note.tags || []).map(normalizeTag))),
      }))
      .sort(sortByUpdatedAtDesc);
  } catch (error) {
    console.error("Failed to load notes from storage", error);
    return [];
  }
}
