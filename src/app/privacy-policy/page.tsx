import type { Metadata } from "next";
import LegalPage, { type LegalSection } from "@/components/layout/LegalPage";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How personal information is handled in connection with enquiries made through the Offscript website.",
};

/** Change this date whenever the policy wording changes. It is shown beneath the policy. */
const LAST_UPDATED = "26 October 2026";

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "This website is operated by Offscript_co (“Offscript”, “we” or “us”), based in Dhaka, Bangladesh.",
    ],
  },
  {
    heading: "Enquiries made through this website",
    paragraphs: [
      "The contact form on this website does not transmit information to us directly. When you complete the form, it prepares a draft email addressed to Offscript, using the email application on your own device. The details you enter, namely a name, an email address, an optional company name, any services of interest that you select, and a message, are placed in that draft.",
      "Nothing reaches us unless and until you choose to send that email yourself. The website does not submit the form to any server operated by us or on our behalf, and it does not use a third-party form-submission service.",
      "Once you send the email, it is handled by the email services involved in sending and receiving it. Those services process the message in accordance with their own terms and privacy policies.",
    ],
  },
  {
    heading: "Retention of information",
    paragraphs: [
      "Enquiries are retained for seven (7) calendar days and are then deleted, unless Offscript has begun working with the person who made the enquiry.",
      "Where Offscript begins working with a person, the seven-day period no longer applies to that person’s information. This policy does not set a retention period for information relating to clients.",
    ],
  },
  {
    heading: "Analytics, cookies and tracking",
    paragraphs: [
      "This website does not use analytics tools, cookies, advertising pixels or other tracking technologies.",
    ],
  },
  {
    heading: "Third-party content and links",
    paragraphs: [
      "No third-party embedded services, such as social media feeds or video players, are used on this website. Images, video and other media files are, however, delivered by content-delivery providers, and your device connects to those providers’ servers in order to retrieve them.",
      "This website also contains links to external services, including Instagram and WhatsApp. If you follow those links, the terms and privacy policy of the relevant provider apply.",
    ],
  },
  {
    heading: "Questions and requests about your information",
    paragraphs: [
      `If you have any questions about this policy, or any request concerning your personal information, please write to us at ${CONTACT.email}.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy describes how personal information is handled in connection with enquiries made through this website."
      sections={sections}
      updated={LAST_UPDATED}
    />
  );
}