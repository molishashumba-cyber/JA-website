"use client";

import { useFormStatus } from "react-dom";

// A submit button that asks "Are you sure?" first.
export function ConfirmButton({
  message,
  children,
  small,
}: {
  message: string;
  children: React.ReactNode;
  small?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className={`rounded-full border-2 border-red font-bold text-dark hover:bg-red hover:text-white disabled:opacity-60 ${small ? "min-h-9 px-3 text-sm" : "min-h-11 px-5"}`}
    >
      {pending ? "Deleting…" : children}
    </button>
  );
}
