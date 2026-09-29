// Email alerts for new form submissions, sent through Resend (resend.com).
// Only active when RESEND_API_KEY is set in the environment variables.

const FORM_LABELS = { contact: "Contact", volunteer: "Volunteer", partner: "Partnership" } as const;

export async function sendFormAlert(
  formType: keyof typeof FORM_LABELS,
  fields: { label: string; value: string }[],
  replyTo: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = process.env.FORM_ALERT_EMAIL || "info@jazambia.org";
  const from = process.env.FORM_ALERT_FROM || "JA Zambia Website <onboarding@resend.dev>";
  const name = fields.find((f) => f.label === "Full name")?.value ?? "Someone";
  const text = [
    `New ${FORM_LABELS[formType].toLowerCase()} form submission from the JA Zambia website.`,
    "",
    ...fields.filter((f) => f.value).map((f) => `${f.label}${f.label.endsWith("?") ? "" : ":"}\n${f.value}\n`),
    "Reply to this email to answer them directly. All submissions are also saved in the website's admin area.",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        subject: `${FORM_LABELS[formType]} form: ${name}`,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("Form alert email failed:", res.status, await res.text());
  } catch (err) {
    // The submission is already saved, so a failed alert must not fail the form.
    console.error("Form alert email failed:", err);
  }
}
