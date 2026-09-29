"use client";

import { useActionState } from "react";
import { changePassword, type ActionState } from "@/app/admin/actions";

const inputClass =
  "mt-1 block w-full rounded-lg border-2 border-dark/15 px-3 py-2.5 focus:border-teal focus:outline-none";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, { status: "idle" } as ActionState);
  return (
    <form action={action} className="mt-4 space-y-4">
      <label className="block font-bold text-dark">
        New password
        <span className="block text-sm font-normal text-dark/75">At least 10 characters.</span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={10}
          required
          className={inputClass}
        />
      </label>
      <label className="block font-bold text-dark">
        Type it again
        <input name="confirm" type="password" autoComplete="new-password" required className={inputClass} />
      </label>
      {state.status !== "idle" && (
        <p role="status" className="font-semibold text-dark">
          {state.status === "success" ? "✓ " : "⚠ "}
          {state.message}
        </p>
      )}
      <button
        disabled={pending}
        className="min-h-11 rounded-full bg-azure px-5 font-bold text-white hover:bg-boundless disabled:opacity-60"
      >
        {pending ? "Saving…" : "Change password"}
      </button>
    </form>
  );
}
