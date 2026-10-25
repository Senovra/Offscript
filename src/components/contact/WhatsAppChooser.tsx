import { WHATSAPP_GREETING, WHATSAPP_OPTIONS, whatsappUrl } from "@/lib/contact";

/**
 * Choose which Offscript WhatsApp number to message. Plain links, so it works
 * the same with a mouse, a finger or a keyboard. Each opens WhatsApp in a new
 * tab with a short opening line already written.
 */
export default function WhatsAppChooser() {
  return (
    <div>
      <p className="type-mono text-ash">Prefer WhatsApp? Choose a number</p>

      <ul className="mt-4 border-t border-[var(--line)]">
        {WHATSAPP_OPTIONS.map((option) => (
          <li key={option.number} className="border-b border-[var(--line)]">
            <a
              href={whatsappUrl(option.number, WHATSAPP_GREETING)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${option.label}, ${option.display}. Opens WhatsApp in a new tab.`}
              className="group flex items-center justify-between gap-4 py-4 transition-all duration-300 hover:pl-3 focus-visible:pl-3 active:pl-3"
            >
              <span className="min-w-0">
                <span className="block text-[0.9375rem] text-paper">{option.label}</span>
                <span className="type-mono mt-0.5 block text-ash transition-colors duration-300 group-hover:text-fog">
                  {option.display}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-fog transition-transform duration-500 [transition-timing-function:var(--ease-push)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}