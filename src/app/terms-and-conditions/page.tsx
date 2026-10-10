import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

const sections: LegalSection[] = [
  {
    heading: "Using this website",
    paragraphs: [
      "These terms cover your use of this website, which is run by [Offscript's full legal name]. By using the site you agree to them. They don't replace any written agreement we make with you for actual work.",
    ],
    ask: "Do you already have standard client terms for projects? If so, send them and we'll link to them from here.",
  },
  {
    heading: "What you can do",
    paragraphs: [
      "You're welcome to look around and send us an enquiry. Please don't try to break the site, overload it, or use it for anything unlawful.",
    ],
  },
  {
    heading: "Our content",
    paragraphs: [
      "The words, design and media on this site belong to Offscript or the people who've licensed them to us. Please ask before you copy or reuse anything.",
      "Some third-party material is used under its own licence. Those credits are on the Credits page.",
    ],
    ask: "Once real project media is in, tell us who owns the rights to each piece, including client work you can show.",
  },
  {
    heading: "No guarantees",
    paragraphs: [
      "We do our best to keep the site accurate and running, but we can't promise it will always be free of errors or available.",
    ],
  },
  {
    heading: "Liability",
    paragraphs: ["[Wording on limits of liability to be written by a solicitor.]"],
    ask: "This is one for your solicitor, not us.",
  },
  {
    heading: "Links to other sites",
    paragraphs: [
      "Our site may link to other websites. We don't control them and aren't responsible for what they say or do.",
    ],
  },
  {
    heading: "Which law applies",
    paragraphs: ["[Country or state whose law applies, and where disputes are heard.]"],
    ask: "Please confirm where Offscript is registered.",
  },
  {
    heading: "Changes",
    paragraphs: [
      "We may update these terms. The latest version will always be on this page. Last updated: [date].",
    ],
  },
];

export default function TermsPage() {
  return <LegalPage title="Terms & Conditions" sections={sections} />;
}