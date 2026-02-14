/**
 * Sensitive fields configuration.
 *
 * Every field ID listed here will be **excluded** from generated PDFs
 * (including any answer data). Pre-populated (CYRAS) field IDs are
 * included so that they are also stripped if they happen to be stored
 * in the plan_sections.fields JSONB column.
 *
 * Special keys:
 *  - "__actions"  → excludes the entire My Goal Plan / Action Table
 *                    for that section from the PDF.
 *  - IDs ending with "-attachments" cover attachment metadata stored
 *    alongside their parent table field.
 */

export const SENSITIVE_FIELDS: Record<string, string[]> = {
  "about-me": [
    // My gender is (pre-populated, but may be in fields)
    "gender",
    // My pronouns are
    "pronouns",
    // My important belongings or taonga and how they are kept safe (table + attachments)
    "belongings",
    "belongings-attachments",
    // My Legal status or orders (pre-populated)
    "legalStatus",
  ],

  identity: [
    // My religion or spirituality is
    "religious",
    // Important things to know about my faith/religion or spirituality needs
    "faith-needs",
  ],

  connections: [
    // Friends who are important to me are
    "friends",
    // My Connections are (table + attachments)
    "connections",
    "connections-attachments",
    // People currently unable to have contact with me and why
    "no-contact-people",
  ],

  health: [
    // My last medical visit
    "last-medical-visit",
    // My current treatment or medication is (table)
    "treatment-medication",
    // Other important people or health services who I connect with for my health
    "other-health-services",
    // My Immunisations + consent checkbox
    "immunisations",
    "no-consent-immunisations",
    // Attach immunisation record (if stored)
    "immunisations-attachments",
    // My mental health needs and any supports or interventions currently involved (table)
    "mental-health",
    // My alcohol or substances use
    "substance-use",
    // Any services and supports currently helping with my substance use
    "substance-support",
    // Other health needs that affect my life are
    "other-health-needs",
  ],

  disability: [
    // Attach documents (attachment metadata for both tables)
    "disability-attachments",
    "disability-services-attachments",
  ],

  education: [
    // Attach documents (attachment metadata if present)
    "education-attachments",
  ],

  transition: [
    // My planned living arrangement after care
    "living-arrangement",
    // Attach documents (attachment metadata if present)
    "transition-attachments",
  ],

  "youth-justice": [
    // My active charges (pre-populated)
    "active-charges",
    // My previous youth justice charges (pre-populated)
    "previous-charges",
    // My previous youth justice placement History (pre-populated)
    "placement-history",
    // What are the views of my significant people … placement
    "placement-views",
    "placement-views-rationale",
    // My views on staying in residence, remand home …
    "my-placement-views",
    // My whānau … views on my offending
    "whanau-views-offending",
    // What supports am I engaging with (pre and post arrest)
    "supports-engaging",
    // Are there specific reasons police oppose my bail?
    "police-opposition",
    // In the last six months, have I escaped police custody …
    "custody-breaches",
    "custody-breaches-details",
    // Sentencing questions (s238, 311, 173-175, 34A)
    "sentencing",
    // Do I have any of the following worries or concerns
    "concerns-details",
    // What option(s) are available to me as an alternative …
    "custody-alternatives",
    "custody-alternatives-supports",
  ],

  residence: [
    // I arrived on (pre-populated)
    "arrived-on",
    // My early leaving date / expected leaving date
    "expected-leaving-date",
    // Have I behaved or acted in a way … (table + attachments)
    "unsafe-behaviour",
    "unsafe-behaviour-attachments",
    // What are my preferences and comfort levels …
    "living-preferences",
    // Entire My Goal Plan for this section
    "__actions",
  ],

  "care-request": [
    // Is a care arrangement needed
    "care-arrangement-needed",
    // CYRAS ID (pre-populated)
    "cyras-id",
    // Site referring (pre-populated)
    "site-referring",
    // Care needed (all checkboxes + description)
    "care-immediate-safety",
    "care-respite",
    "care-primary",
    "care-transition",
    "care-specialist",
    "care-group-living",
    "care-disability",
    "care-need-description",
    // Care type requested
    "care-type-approved",
    "care-type-family-whare",
    "care-type-staffed",
    "care-type-other",
    // Care with other tamariki?
    "care-with-others",
    "care-with-others-rationale",
    // By when is care needed?
    "care-needed-by",
    // Priority locations/areas for care
    "priority-locations",
    // Proposed length of stay
    "stay-emergency",
    "stay-interim",
    "stay-short-term",
    "stay-6-months",
    "stay-other",
    // Whanau care options explored?
    "whanau-options",
    // Care history (table + attachments)
    "care-history",
    "care-history-attachments",
    // Why is a care arrangement needed
    "why-care-needed",
    // Any further comments, safety or behavioural concerns …
    "caregiver-concerns",
  ],
};

/**
 * Returns true if the given field should be hidden from PDFs.
 */
export const isSensitiveField = (sectionId: string, fieldId: string): boolean => {
  const sectionSensitive = SENSITIVE_FIELDS[sectionId];
  if (!sectionSensitive) return false;
  return sectionSensitive.includes(fieldId);
};

/**
 * Returns true if the action table for a section should be hidden from PDFs.
 */
export const isSectionActionsHidden = (sectionId: string): boolean => {
  const sectionSensitive = SENSITIVE_FIELDS[sectionId];
  if (!sectionSensitive) return false;
  return sectionSensitive.includes("__actions");
};
