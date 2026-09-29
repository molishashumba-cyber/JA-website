import { NextResponse, type NextRequest } from "next/server";
import { forms, type FormType } from "@/lib/forms";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

// Downloads form submissions as a CSV file that opens in Excel or Google Sheets.
export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) return new NextResponse("Not available", { status: 404 });
  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/admin/login", request.url));

  const type = request.nextUrl.searchParams.get("type");
  const status = request.nextUrl.searchParams.get("status");
  let query = supabase.from("form_submissions").select("*").order("created_at", { ascending: false }).limit(10000);
  if (type && type in forms) query = query.eq("form_type", type);
  if (status === "new" || status === "handled") query = query.eq("status", status);
  // Security rules return nothing to people who aren't on the team list.
  const { data, error } = await query;
  if (error) return new NextResponse("Could not export", { status: 500 });

  const detailKeys = Array.from(new Set((data ?? []).flatMap((r) => Object.keys(r.details ?? {}))));
  const labelFor = (key: string) =>
    Object.values(forms)
      .flatMap((f) => f.fields)
      .find((f) => f.name === key)?.label ?? key;

  const header = [
    "Date",
    "Form",
    "Status",
    "Name",
    "Email",
    "Phone",
    "Organisation",
    "Message",
    ...detailKeys.map(labelFor),
  ];
  const cell = (v: unknown) => {
    let s = Array.isArray(v) ? v.join(", ") : v == null ? "" : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // stop spreadsheet formulas
    return `"${s.replace(/"/g, '""')}"`;
  };
  const lines = (data ?? []).map((r) =>
    [
      new Date(r.created_at).toLocaleString("en-GB", { timeZone: "Africa/Lusaka" }),
      forms[r.form_type as FormType]?.title ?? r.form_type,
      r.status,
      r.name,
      r.email,
      r.phone,
      r.organisation,
      r.message,
      ...detailKeys.map((k) => r.details?.[k]),
    ]
      .map(cell)
      .join(","),
  );
  const csv = "﻿" + [header.map(cell).join(","), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ja-zambia-submissions-${date}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
