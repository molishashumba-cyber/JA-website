// Renders plain text typed in the admin area: a blank line starts a new paragraph.
export function Prose({ text, className = "" }: { text?: string; className?: string }) {
  if (!text?.trim()) return null;
  const paragraphs = text.trim().split(/\n\s*\n/);
  return (
    <div className={`space-y-4 text-lg leading-relaxed text-dark/80 ${className}`}>
      {paragraphs.map((p, i) => (
        <p key={i} className="whitespace-pre-line">
          {p}
        </p>
      ))}
    </div>
  );
}
