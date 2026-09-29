"use client";

import { useActionState } from "react";
import { grantAccess, type ActionState } from "@/app/admin/actions";

export function GrantForm() {
  const [state, action, pending] = useActionState(grantAccess, { status: "idle" } as ActionState);
  return (
    <form action={action} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="flex-1 font-bold text-dark">
        Email
        <input
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-lg border-2 border-dark/15 px-3 py-2.5 focus:border-teal focus:outline-none"
        />
      </label>
      <label className="font-bold text-dark">
        Role
        <select name="role" className="mt-1 block rounded-lg border-2 border-dark/15 px-3 py-2.5">
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <button
        disabled={pending}
        className="min-h-11 rounded-full bg-azure px-5 font-bold text-white hover:bg-boundless disabled:opacity-60"
      >
        {pending ? "Giving access…" : "Give access"}
      </button>
      {state.status !== "idle" && (
        <p role="status" className="basis-full font-semibold text-dark sm:order-last">
          {state.status === "success" ? "✓ " : "⚠ "}
          {state.message}
        </p>
      )}
    </form>
  );
}
