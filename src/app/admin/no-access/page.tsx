import type { Metadata } from "next";
import { signOut } from "../actions";

export const metadata: Metadata = { title: "No access" };

export default function NoAccessPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-dark/10 sm:p-8">
        <h1 className="text-2xl font-extrabold text-dark">You&apos;re logged in, but don&apos;t have access yet</h1>
        <p className="mt-3 text-dark/80">
          Ask a JA Zambia admin to give your email address access on the <strong>Team access</strong> page of the admin
          area.
        </p>
        <form action={signOut} className="mt-6">
          <button className="min-h-11 rounded-full border-2 border-dark/20 px-5 font-bold text-dark hover:bg-pearl">
            Log out
          </button>
        </form>
      </div>
    </main>
  );
}
