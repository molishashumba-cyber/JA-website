import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-sm ring-1 ring-dark/10 sm:p-8">
        <Logo className="h-11 w-auto" />
        <h1 className="mt-6 text-2xl font-extrabold text-dark">Admin login</h1>
        <p className="mt-1 text-dark/80">For the JA Zambia team.</p>
        <LoginForm />
      </div>
    </main>
  );
}
