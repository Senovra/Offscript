import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

const sections: LegalSection[] = [
  {
    heading: "Using this website",
    paragraphs: [
      "These terms cover your use of this website, which is run by Offscript Ltd. (trading as Offscript). By using the site you agree to them. They don't replace any written agreement we make with you for actual work.",
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
    heading: "Limits of Liability",
    paragraphs: [
      "At Offscript, we are committed to providing professional, reliable, and high-quality media and digital marketing services. However, by engaging with our services or using our website, you acknowledge and agree to the following limitations of liability.",
    ],
    points: [
      {
        title: "Limitation of Liability",
        text: "Offscript shall not be held liable for any direct, indirect, incidental, consequential, or special damages arising from the use of our services, website, content, or materials, to the fullest extent permitted by applicable law.",
      },
      {
        title: "Marketing and Performance Results",
        text: "While we strive to deliver effective marketing strategies and quality results, Offscript does not guarantee specific outcomes, including increased sales, audience growth, engagement rates, website traffic, leads, or revenue. Marketing performance may depend on external factors beyond our control.",
      },
      {
        title: "Third-Party Platforms",
        text: "Our services may involve third-party platforms such as Instagram, Facebook, TikTok, Google, and other digital services. Offscript is not responsible for platform outages, algorithm changes, account restrictions, suspensions, policy updates, or other disruptions caused by third-party providers.",
      },
      {
        title: "Client Responsibilities",
        text: "Clients are responsible for ensuring that all information, materials, images, videos, and other content provided to Offscript are accurate, lawful, and authorised for use. Offscript shall not be held responsible for issues arising from inaccurate information or unauthorised materials supplied by clients.",
      },
      {
        title: "Content and Intellectual Property",
        text: "Offscript takes reasonable care when producing and publishing creative materials. However, we are not responsible for unauthorised use, redistribution, modification, or misuse of published content by third parties, where such actions are outside our reasonable control.",
      },
      {
        title: "Website Accuracy and Availability",
        text: "Although we aim to keep our website accurate and up to date, Offscript does not guarantee that all information will always be complete, accurate, uninterrupted, or free from errors. We reserve the right to modify or update website content and services without prior notice.",
      },
      {
        title: "Maximum Liability",
        text: "To the fullest extent permitted by applicable law, Offscript’s total liability for any claim arising from our services shall not exceed the total amount paid by the client to Offscript for the specific service giving rise to the claim.",
      },
      {
        title: "Acceptance of Terms",
        text: "By accessing our website, contacting us, or engaging with our services, you acknowledge that you have read and understood these limitations of liability and agree to them, subject to applicable laws and any separate written agreement between Offscript and the client.",
      },
    ],
  },
  {
    heading: "Links to other sites",
    paragraphs: [
      "Our site may link to other websites. We don't control them and aren't responsible for what they say or do.",
    ],
  },
  {
    heading: "Governing Law and Jurisdiction",
    paragraphs: [
      "Offscript operates in multiple jurisdictions, including Sri Lanka and Bangladesh. The laws applicable to any services provided by Offscript shall be determined by the country in which the relevant branch providing the services operates.",
      "Services provided through our Sri Lankan branch shall be governed by the laws of the Democratic Socialist Republic of Sri Lanka, while services provided through our Bangladesh branch shall be governed by the laws of the People’s Republic of Bangladesh.",
      "Nothing in this policy shall exclude, restrict, or limit any rights or obligations that cannot legally be excluded, restricted, or limited under applicable law.",
    ],
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