"use client";

import type { ReactNode } from "react";
import type { Note } from "../page";
import { format } from "date-fns";

type NoteListProps = {
  notes: Note[];
  searchTerm: string;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
};

export function NoteList({ notes, searchTerm, onEdit, onDelete }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-700 bg-black/60 p-8 text-center text-sm text-neutral-400">
        No notes yet. Start typing to capture your thoughts.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {notes.map((note) => (
        <article
          key={note.id}
          className="flex h-full flex-col justify-between rounded-3xl border border-neutral-800 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-5 shadow-lg shadow-purple-900/20 transition hover:border-neutral-600 hover:shadow-purple-800/40"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">
                {highlightSearch(note.title || "Untitled note", searchTerm)}
              </h3>
              <div className="shrink-0 text-right text-[11px] uppercase tracking-wide text-neutral-500">
                <div>{format(new Date(note.updatedAt), "MMM d, yyyy")}</div>
                <div className="text-[10px] text-neutral-600">
                  Edited {format(new Date(note.updatedAt), "p")}
                </div>
              </div>
            </div>
            <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-300">
              {highlightSearch(note.content || "No details added yet.", searchTerm)}
            </p>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {note.tags.length > 0 ? (
                note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-200"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-500">
                  #untagged
                </span>
              )}
            </div>
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => onEdit(note)}
                className="rounded-xl border border-neutral-700 px-3 py-1 text-xs font-semibold text-neutral-200 transition hover:border-blue-500 hover:text-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="rounded-xl border border-red-600/50 bg-red-600/10 px-3 py-1 text-xs font-semibold text-red-200 transition hover:bg-red-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function highlightSearch(text: string, term: string): ReactNode {
  if (!term.trim()) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(term.trim())})`, "ig");
  const parts = text.split(regex);

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-yellow-500/40 px-1 py-0.5 text-yellow-100"
      >
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
