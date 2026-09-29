import type { Metadata } from "next";
import { requireStaff } from "@/lib/admin/auth";
import { AdminPageTitle } from "../AdminPageTitle";
import { PasswordForm } from "./PasswordForm";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const { user, role } = await requireStaff();
  return (
    <>
      <AdminPageTitle title="My account" description={`${user.email} · ${role === "admin" ? "Admin" : "Editor"}`} />
      <section className="max-w-md rounded-2xl bg-white p-5 shadow-sm ring-1 ring-dark/10">
        <h2 className="text-lg font-extrabold text-dark">Change password</h2>
        <PasswordForm />
      </section>
    </>
  );
}
