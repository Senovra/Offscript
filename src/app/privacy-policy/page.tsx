import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "This website is run by [Offscript's full legal name], based at [registered address]. If you have any questions about your data, write to us at [contact email].",
    ],
    ask: "We need the exact registered company name and address.",
  },
  {
    heading: "What we collect",
    paragraphs: [
      "If you send us an enquiry, we get what you type into the form: your name, email address, company if you add one, the kind of work you're interested in, and your message.",
      "Like most websites, our hosting may also record basic technical details such as your IP address and browser when you visit.",
    ],
    ask: "Which host will the site run on? We'll check what it logs and update this.",
  },
  {
    heading: "Why we use it",
    paragraphs: [
      "We use your enquiry to reply to you and talk about your project. We don't need it for anything else.",
    ],
    ask: "Is that the whole story? If you plan to add anyone to a mailing list, say so and we'll write it in.",
  },
  {
    heading: "Who else sees it",
    paragraphs: [
      "Enquiries pass through [the form or email service you choose] on their way to us. They handle the message for us and don't use it for their own purposes.",
    ],
    ask: "We haven't connected a form service yet. Once you've picked one, we'll name it here.",
  },
  {
    heading: "How long we keep it",
    paragraphs: [
      "We keep enquiries for [how long] and then delete them, unless we've started working together.",
    ],
    ask: "Please decide on a retention period.",
  },
  {
    heading: "Your rights",
    paragraphs: [
      "You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Just write to the address above and we'll get back to you.",
    ],
    ask: "The exact rights depend on where your customers are. Your solicitor will know what to add.",
  },
  {
    heading: "Cookies and analytics",
    paragraphs: [
      "[Describe any cookies or analytics tools the site uses, or say that it uses none.]",
    ],
    ask: "We haven't added analytics. If you want it, tell us which tool and we'll add the details and a cookie notice if one is needed.",
  },
  {
    heading: "Changes",
    paragraphs: [
      "If we change this policy, the new version will be on this page. Last updated: [date].",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return <LegalPage title="Privacy Policy" sections={sections} />;
}