// Definitions of the website's forms, shared by the form on the page and the
// server code that checks and saves submissions.

export type FormType = "contact" | "volunteer" | "partner";

export type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkboxes";
  required?: boolean;
  options?: string[];
  maxLength: number;
  autoComplete?: string;
  hint?: string;
};

// Fields saved to their own column; everything else goes into `details`.
export const COLUMN_FIELDS = ["name", "email", "phone", "organisation", "message"] as const;

const name: Field = {
  name: "name",
  label: "Full name",
  type: "text",
  required: true,
  maxLength: 200,
  autoComplete: "name",
};
const email: Field = {
  name: "email",
  label: "Email",
  type: "email",
  required: true,
  maxLength: 320,
  autoComplete: "email",
};
const phone: Field = { name: "phone", label: "Phone", type: "tel", maxLength: 50, autoComplete: "tel" };

export const CONTACT_TOPICS = [
  "General question",
  "Bring JA to my school",
  "Partnership or sponsorship",
  "Volunteering",
  "Media enquiry",
] as const;

export const forms: Record<FormType, { title: string; submitLabel: string; success: string; fields: Field[] }> = {
  contact: {
    title: "Send us a message",
    submitLabel: "Send message",
    success: "Thank you! Your message has been sent. Our team will get back to you soon.",
    fields: [
      name,
      email,
      phone,
      {
        name: "organisation",
        label: "School or organisation",
        type: "text",
        maxLength: 200,
        autoComplete: "organization",
      },
      { name: "topic", label: "What is it about?", type: "select", options: [...CONTACT_TOPICS], maxLength: 100 },
      { name: "message", label: "Message", type: "textarea", required: true, maxLength: 5000 },
    ],
  },
  volunteer: {
    title: "Volunteer with JA Zambia",
    submitLabel: "Sign me up",
    success: "Thank you for offering your time! Our team will be in touch about volunteering opportunities.",
    fields: [
      name,
      email,
      { ...phone, required: true },
      {
        name: "organisation",
        label: "Employer or organisation",
        type: "text",
        maxLength: 200,
        autoComplete: "organization",
      },
      {
        name: "roles",
        label: "How would you like to help?",
        type: "checkboxes",
        options: [
          "Classroom volunteer or mentor",
          "Company Program business adviser",
          "Judge at Company of the Year or an Innovation Camp",
          "Job Shadow host at my workplace",
          "Not sure yet",
        ],
        maxLength: 500,
      },
      {
        name: "availability",
        label: "When are you usually available?",
        type: "select",
        options: ["Weekdays", "Weekends", "Either"],
        maxLength: 50,
      },
      {
        name: "message",
        label: "Anything else we should know?",
        type: "textarea",
        maxLength: 5000,
        hint: "For example, your experience or the schools or areas you could reach.",
      },
    ],
  },
  partner: {
    title: "Partner with JA Zambia",
    submitLabel: "Send enquiry",
    success: "Thank you for your interest in partnering with us! Our team will contact you shortly.",
    fields: [
      name,
      { name: "job_title", label: "Job title", type: "text", maxLength: 200, autoComplete: "organization-title" },
      {
        name: "organisation",
        label: "Company or organisation",
        type: "text",
        required: true,
        maxLength: 200,
        autoComplete: "organization",
      },
      email,
      phone,
      {
        name: "interests",
        label: "What are you interested in?",
        type: "checkboxes",
        options: [
          "Sponsoring a program",
          "Sponsoring an event (e.g. Company of the Year, Girls LEAD Camp)",
          "Employee volunteering",
          "Hosting Job Shadow days",
          "Something else",
        ],
        maxLength: 500,
      },
      { name: "message", label: "Tell us about your goals", type: "textarea", required: true, maxLength: 5000 },
    ],
  },
};

export type FormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string>;
      values?: Record<string, string | string[]>;
    };

// Hidden spam traps: bots fill in every field and submit instantly.
export const HONEYPOT_FIELD = "website";
export const STARTED_FIELD = "started_at";
export const MIN_FILL_MS = 3000;
