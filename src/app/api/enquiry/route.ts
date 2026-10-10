import { NextResponse } from "next/server";

/**
 * Enquiry endpoint.
 *
 * Provider-agnostic: set ENQUIRY_WEBHOOK_URL in .env.local (Formspree, Make,
 * Zapier, or any service that accepts a JSON POST) and enquiries are forwarded
 * there. Nothing is stored on this server.
 *
 * The payload includes ready-made `subject` and `text` fields built from the
 * visitor's tags and message, so an email can be drafted straight from them.
 *
 *   Development, no webhook : the enquiry is logged to the terminal and succeeds.
 *   Production, no webhook  : returns 503, so visitors never see a false
 *                             "sent" message while nothing is connected.
 */

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend success and drop it.
  if (clean(body.website, 200)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const company = clean(body.company, 160);
  const message = clean(body.message, 4000);
  const consent = body.consent === true;
  const interests = Array.isArray(body.interests)
    ? body.interests
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.slice(0, 80))
        .slice(0, 16)
    : [];

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10 || !consent) {
    return NextResponse.json({ error: "invalid_fields" }, { status: 422 });
  }

  // Submitted implausibly fast: almost certainly a bot.
  const startedAt = Number(body.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2500) {
    return NextResponse.json({ ok: true });
  }

  const interestLine = interests.length > 0 ? interests.join(", ") : "Not specified";

  const subject = `New enquiry: ${
    interests.length > 0 ? interests.join(", ") : "General"
  } (${name})`;

  const text = [
    `New enquiry from ${name} <${email}>`,
    company ? `Company: ${company}` : null,
    `Interested in: ${interestLine}`,
    "",
    "Message:",
    message,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const payload = {
    subject,
    text,
    name,
    email,
    company,
    interests,
    message,
    receivedAt: new Date().toISOString(),
  };

  const webhook = process.env.ENQUIRY_WEBHOOK_URL;

  if (webhook) {
    try {
      const response = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
    }
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[Offscript enquiry]\n" + subject + "\n\n" + text);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "not_configured" }, { status: 503 });
}