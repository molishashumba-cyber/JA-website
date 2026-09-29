"use client";

import { useActionState } from "react";
import { signIn, type ActionState } from "../actions";

const inputClass =
  "mt-1 block w-full rounded-lg border-2 border-dark/15 bg-white px-3 py-2.5 text-base text-dark focus:border-teal focus:outline-none";

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, { status: "idle" } as ActionState);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block font-bold text-dark">
        Email
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </label>
      <label className="block font-bold text-dark">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state.status === "error" && (
        <p role="alert" className="rounded-lg bg-red/10 p-3 font-semibold text-dark ring-2 ring-red">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-azure font-bold text-white hover:bg-boundless disabled:opacity-60"
      >
        {pending ? "Logging in…" : "Log in"}
      </button>
      <p className="text-sm text-dark/75">Forgotten your password? Ask a JA Zambia admin to reset it for you.</p>
    </form>
  );
}
