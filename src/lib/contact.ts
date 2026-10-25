/**
 * Offscript's contact details, in one place. The footer and the Contact page
 * both read from here. Only details supplied by Offscript are listed.
 */

export const CONTACT = {
  email: "neveroffscript@gmail.com",
  location: "Dhaka, Bangladesh · Colombo, Sri Lanka",
  /** Bangladesh first, then Sri Lanka. `tel` is the dialling form for tel: links. */
  phones: [
    { label: "Bangladesh", display: "+880 19 7026 6535", tel: "+8801970266535" },
    { label: "Sri Lanka", display: "+94 76 664 7231", tel: "+94766647231" },
  ],
};

/**
 * WhatsApp options. `number` is digits only, with the country code, which is
 * the form wa.me needs.
 */
export const WHATSAPP_OPTIONS = [
  { label: "International", display: "+880 13 0866 6103", number: "8801308666103" },
  { label: "Bangladesh Branch", display: "+880 19 7026 6535", number: "8801970266535" },
  { label: "Sri Lanka Branch", display: "+94 76 664 7231", number: "94766647231" },
];

/** The opening line of a WhatsApp chat started from the Contact page. */
export const WHATSAPP_GREETING = "Hello Offscript, I would like to make an enquiry.";

export function whatsappUrl(number: string, text?: string): string {
  return text
    ? `https://wa.me/${number}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${number}`;
}

/** Confirmed Instagram accounts, main account first. */
export const INSTAGRAM_ACCOUNTS = [
  { handle: "offscript_co", detail: "Bangladesh · Main", spoken: "Bangladesh, main account" },
  { handle: "offscript_co_lk", detail: "Sri Lanka · Branch", spoken: "Sri Lanka, branch" },
  {
    handle: "offscript_co_automotive",
    detail: "Automotive · Sub-branch",
    spoken: "Automotive, sub-branch",
  },
];