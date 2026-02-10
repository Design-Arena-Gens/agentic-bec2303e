"use client";

type TagFilterProps = {
  tags: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
};

export function TagFilter({ tags, selected, onChange }: TagFilterProps) {
  if (tags.length === 0) {
    return null;
  }

  const handleToggle = (tag: string) => {
    if (selected.includes(tag)) {
      onChange(selected.filter((item) => item !== tag));
    } else {
      onChange([...selected, tag]);
    }
  };

  const handleReset = () => {
    onChange([]);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleReset}
        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
          selected.length === 0
            ? "border-blue-500/70 bg-blue-500/20 text-blue-100"
            : "border-neutral-700 text-neutral-300 hover:border-blue-400 hover:text-blue-100"
        }`}
      >
        All
      </button>
      {tags.map((tag) => {
        const isActive = selected.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => handleToggle(tag)}
            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
              isActive
                ? "border-purple-500/80 bg-purple-500/20 text-purple-100"
                : "border-neutral-700 text-neutral-300 hover:border-purple-400 hover:text-purple-100"
            }`}
          >
            #{tag}
          </button>
        );
      })}
    </div>
  );
}
