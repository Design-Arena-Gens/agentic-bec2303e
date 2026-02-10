"use client";

import { FormEvent, useMemo, useState } from "react";

export type NoteDraft = {
  title: string;
  content: string;
  tags: string[];
};

type NoteFormProps = {
  onSubmit: (draft: NoteDraft) => void;
  onCancelEdit?: () => void;
  editing?: boolean;
  initialValue?: NoteDraft;
};

const DEFAULT_FORM: NoteDraft = {
  title: "",
  content: "",
  tags: [],
};

export function NoteForm({
  onSubmit,
  onCancelEdit,
  editing = false,
  initialValue,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialValue?.title ?? DEFAULT_FORM.title);
  const [content, setContent] = useState(initialValue?.content ?? DEFAULT_FORM.content);
  const [tagInput, setTagInput] = useState(
    initialValue?.tags.length ? initialValue.tags.join(", ") : "",
  );

  const tags = useMemo(
    () =>
      tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagInput],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const cleanedTitle = title.trim();
    const cleanedContent = content.trim();

    if (!cleanedTitle && !cleanedContent) {
      return;
    }

    onSubmit({
      title: cleanedTitle,
      content: cleanedContent,
      tags,
    });

    if (!editing) {
      setTitle(DEFAULT_FORM.title);
      setContent(DEFAULT_FORM.content);
      setTagInput("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-neutral-800 bg-black/60 p-5 shadow-lg shadow-blue-900/30 backdrop-blur-sm"
    >
      <h2 className="mb-4 text-lg font-semibold text-white">
        {editing ? "Edit note" : "Create a note"}
      </h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring focus:ring-blue-500/30"
            placeholder="Trip planning, grocery list, meeting notes..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="content">
            Details
          </label>
          <textarea
            id="content"
            className="h-40 w-full resize-none rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring focus:ring-blue-500/30"
            placeholder="Write down your ideas, reminders, and to-dos."
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300" htmlFor="tags">
            Tags
          </label>
          <input
            id="tags"
            className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500 focus:ring focus:ring-blue-500/30"
            placeholder="work, personal, travel"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
          />
          <p className="text-xs text-neutral-500">Separate tags with commas.</p>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:scale-[1.01] hover:shadow-blue-500/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 active:scale-[0.99]"
          >
            {editing ? "Update note" : "Save note"}
          </button>
          {editing && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-xl border border-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500 hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
