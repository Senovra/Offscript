"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * DRAFT LIST: Offscript to edit. Add, remove or rename freely.
 * "Other" is special: it asks the visitor to describe the work in the message box.
 */
const OPTIONS = [
  "Wedding Shoots",
  "Event Coverage",
  "Brand Films",
  "Product Photography",
  "Corporate Video",
  "Social Media Content",
  "Campaign Strategy",
  "Brand Identity & Design",
  "Website Design",
  "Paid Ads & Performance",
  "Immersive & 3D",
  "Other",
];

const fieldClass =
  "w-full border-b border-ash/50 bg-transparent py-3 text-[1.0625rem] text-paper outline-none transition-colors placeholder:text-ash";

/** A line that draws across the bottom of a field while it has focus. */
const underlineClass =
  "pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-paper transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-focus-within:scale-x-100";

const labelClass =
  "type-mono mb-1 block text-fog transition-colors duration-300 group-focus-within:text-paper";

const panelClass = "border border-[var(--line)] bg-slate p-6 md:p-10";

/** Matches the panel colour so browser autofill never changes the field background. */
const panelStyle = { "--field-bg": "#222225" } as CSSProperties;

/**
 * Enquiry form. Posts JSON to /api/enquiry, which builds the email subject and
 * body from the selected tags and forwards it to whichever provider is connected.
 * Validation is simple and manual. The hidden "website" field is a honeypot.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [interests, setInterests] = useState<string[]>([]);
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const otherSelected = interests.includes("Other");

  const toggleInterest = (option: string) => {
    setInterests((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    );
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const consent = data.get("consent") === "on";

    const next: Record<string, string> = {};
    if (!name) next.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Please enter a valid email address.";
    if (otherSelected && message.length < 20) {
      next.message = "You chose Other, so please describe what you need here.";
    } else if (message.length < 10) {
      next.message = "Tell us a little more about the project.";
    }
    if (!consent) next.consent = "Please confirm to continue.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          interests,
          message,
          consent,
          website: String(data.get("website") ?? ""),
          startedAt: startedAt.current,
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className={panelClass} style={panelStyle}>
        <p className="type-editorial size-lg max-w-[18ch]">
          Thank you. <span className="type-serif">We&apos;ll be in touch.</span>
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`space-y-10 ${panelClass}`}
      style={panelStyle}
    >
      {/* Honeypot: real visitors never see or fill this */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="group">
          <label htmlFor="name" className={labelClass}>
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={fieldClass}
            />
            <span aria-hidden="true" className={underlineClass} />
          </div>
          {errors.name && (
            <p id="name-error" role="alert" className="type-mono mt-2 text-bone">
              {errors.name}
            </p>
          )}
        </div>

        <div className="group">
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={fieldClass}
            />
            <span aria-hidden="true" className={underlineClass} />
          </div>
          {errors.email && (
            <p id="email-error" role="alert" className="type-mono mt-2 text-bone">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="group">
        <label htmlFor="company" className={labelClass}>
          Company <span className="text-ash">(optional)</span>
        </label>
        <div className="relative">
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            className={fieldClass}
          />
          <span aria-hidden="true" className={underlineClass} />
        </div>
      </div>

      <fieldset>
        <legend className="type-mono mb-1 block text-fog">
          Interested in <span className="text-ash">(choose any)</span>
          {interests.length > 0 && (
            <span className="ml-3 text-paper">{interests.length} selected</span>
          )}
        </legend>

        <div className="mt-3 flex flex-wrap gap-2">
          {OPTIONS.map((option) => {
            const selected = interests.includes(option);
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleInterest(option)}
                className={`type-mono inline-flex h-11 items-center border px-4 transition-all duration-300 active:scale-95 ${
                  selected
                    ? "border-paper bg-paper text-ink"
                    : "border-ash/60 text-fog hover:-translate-y-0.5 hover:border-paper hover:text-paper active:border-paper"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block overflow-hidden transition-all duration-300 ${
                    selected ? "mr-2 w-3 opacity-100" : "mr-0 w-0 opacity-0"
                  }`}
                >
                  ✓
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {interests.length > 0 && (
          <button
            type="button"
            onClick={() => setInterests([])}
            className="type-mono mt-4 inline-flex h-11 items-center border-b border-transparent text-ash transition-colors hover:border-current hover:text-paper"
          >
            Clear selection
          </button>
        )}

        {otherSelected && (
          <p className="type-mono mt-2 text-fog">
            Please describe what you need in the box below.
          </p>
        )}
      </fieldset>

      <div className="group">
        <label htmlFor="message" className={labelClass}>
          Tell us about the project
        </label>
        <div className="relative">
          <textarea
            id="message"
            name="message"
            rows={5}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className={`${fieldClass} resize-y`}
          />
          <span aria-hidden="true" className={underlineClass} />
        </div>
        {errors.message && (
          <p id="message-error" role="alert" className="type-mono mt-2 text-bone">
            {errors.message}
          </p>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-fog transition-colors hover:text-paper">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-4 w-4 shrink-0 accent-[#f2f1ed]"
          />
          <span className="max-w-[56ch] text-[0.9375rem]">
            I agree to Offscript using these details to reply to my enquiry.
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="type-mono mt-2 text-bone">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group/send type-mono relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden border border-paper/30 bg-steel px-8 text-paper transition-colors duration-500 hover:text-ink active:text-ink disabled:opacity-50"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-bone transition-transform duration-500 [transition-timing-function:var(--ease-cut)] group-hover/send:scale-x-100 group-active/send:scale-x-100"
          />
          <span className="relative">
            {status === "submitting" ? "Sending" : "Send enquiry"}
          </span>
          <span
            aria-hidden="true"
            className="relative inline-block transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover/send:translate-x-1.5"
          >
            →
          </span>
        </button>

        {status === "error" && (
          <p role="alert" className="type-mono text-bone">
            Something went wrong sending your enquiry. Please try again shortly.
          </p>
        )}
      </div>
    </form>
  );
}