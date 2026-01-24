# My Goal Plan Tables - User Story & Specification

## Overview

The **My Goal Plan** tables are a core feature of the AAMP (Assessment and Management Planning) application. They allow practitioners to document goals, actions, responsibilities, and progress tracking for tamariki (children) and rangatahi (young people) across different areas of their care and wellbeing.

Each section of the plan can have one or more goal plan tables, allowing structured capture of what needs to happen, who will make it happen, and how we'll know when it's achieved.

---

## My Goal Plan Tables by Section

| Section | Table Name / Sub-Heading | Custom "Needs & Goals" Label | Storage Key |
|---------|--------------------------|------------------------------|-------------|
| **About Me** | My Day-to-day Needs & Safety Goals | "My day to day needs and safety goals" | `actions` (default) |
| **About Me** | Behavioural Support | "The support I need with my behavioural needs" | `behavioural_actions` |
| **About Me** | Emotional Support | "The support I need with my emotional well-being" | `emotional_actions` |
| **Identity, Spirituality & Cultural Needs** | My Goal Plan - Identity | "The needs and goals to support me with my Identity, spirituality, cultural needs and safety" | `actions` (default) |
| **Connections** | My Goal Plan - Connections | "My day to day needs and safety goals" (default) | `actions` (default) |
| **Health** | My Goal Plan - Health | "My day to day needs and safety goals" (default) | `actions` (default) |
| **Disability** | My Goal Plan - Disability | "My day to day needs and safety goals" (default) | `actions` (default) |
| **Education, Training or Employment** | My Goal Plan - Education | "My day to day needs and safety goals" (default) | `actions` (default) |
| **Transition to Adulthood** | My Goal Plan - Transition | "My day to day needs and safety goals" (default) | `actions` (default) |
| **Youth Justice** | My Goal Plan - Youth Justice | "My day to day needs and safety goals" (default) | `actions` (default) |
| **Residence & Homes** | My Goal Plan - Residence | "My day to day needs and safety goals" (default) | `actions` (default) |
| **Care Request** | My Goal Plan - Care Request | "My day to day needs and safety goals" (default) | `actions` (default) |
| **Planning With** | My Goal Plan - Planning With | "My day to day needs and safety goals" (default) | `actions` (default) |

---

## Modal Fields (Entry Form)

When a user clicks "Add Action" or clicks on an existing row, a modal opens with the following fields. These fields are **consistent across all My Goal Plan tables**, though the first field's label and guidance prompt can be customised per section.

### Field Definitions

| Field | Label | Type | Guidance Prompt |
|-------|-------|------|-----------------|
| **Needs & Goals** | *Varies by section (see table above)* | Textarea | *Varies by section (see guidance below)* |
| **Action** | "Action" | Textarea | "Outline the actions and tasks required to achieve each identified goal or need. These actions should be clearly defined and follow the SMART criteria—Specific, Measurable, Achievable, Relevant, and Time-bound—to ensure they are practical and effective in supporting progress." |
| **Who is responsible** | "Who is responsible" | Text input | "Include or specify who will support each action to help achieve the goals. This may include whānau, family, hapū, iwi, other professionals, social worker, case leader, care team, specialist services, transitions provider, caregiver support, and others who contribute to the goals. Consider whether any financial responsibilities are linked to the action, and who may help meet those." |
| **By when** | "By when" | Date picker | "Consider the specific timeframe within which each action or outcome should be achieved. Assign clear dates where possible to support accountability and progress tracking. If an action is ongoing, align its timeframe with the length of the AAMP review period to ensure it remains relevant and monitored." |
| **How will I know** | "How will I know I have achieved this" | Textarea | "Think about how we'll recognise when a goal or action has been achieved—what specific changes or outcomes will show progress? If things aren't on track, what signs might help us notice early, and what extra support could help te tamaiti or rangatahi get back on track?" |
| **Review status** | "Review status" | Dropdown | "Use 'Changed' when the original goal or action is no longer relevant, and a new direction, interest, or need has emerged. This may reflect a shift in priorities, circumstances, or preferences." |

### Review Status Options

| Value | When to Use |
|-------|-------------|
| **Achieved** | The goal or action has been successfully completed |
| **In progress** | Work is actively underway toward this goal |
| **Changed** | The original goal is no longer relevant; a new direction has emerged |

---

## Section-Specific "Needs & Goals" Prompts

### About Me - Day-to-day Needs & Safety Goals (Default)
> "Consider what a safe environment looks like for te tamaiti or rangatahi, recognising that oranga (wellbeing) is different for every whānau or family. Record the agreed goals that reflect this understanding. Consider whether te tamaiti or rangatahi is warm, dry, sleeping and eating well, and whether their specific dietary or health needs are being met. Record any identified needs to ensure these aspects of wellbeing are supported."

### About Me - Behavioural Support
> "Consider what support is needed to respond to the behavioural needs in a way that promotes safety, regulation, and wellbeing. Use what is known about their behaviour to plan consistent strategies across settings, including routines, relationships, and environments that help reduce distress and encourage positive behaviour."

### About Me - Emotional Support
> "Consider what helps the child feel emotionally safe, valued, and connected. Use what is known about their emotional needs to plan consistent, responsive support that promotes trust, resilience, and a sense of belonging."

### Identity, Spirituality & Cultural Needs
> "Place value on narratives as a part of their cultural identity. These stories will help to identify what tamariki or rangatahi and whānau or family experience, value, identify and connect with. Consider the principle of mana and work collaboratively with tamariki or rangatahi and whānau or family to ensure they have what they need to keep safe and keep their culture safe such as their whakapapa and whanaungatanga connections. Also consider any barriers that may exist for connection to their whakapapa and how this can affect their cultural safety."

---

## Table Display Columns

When viewing the My Goal Plan table within a section, the following columns are displayed:

| Column | Description |
|--------|-------------|
| **Category** | The section name (e.g., "About Me", "Health") — shown once spanning all rows |
| **Needs & Goals** | The documented needs and goals |
| **Action** | The specific action or task |
| **Who is responsible** | The person(s) responsible for the action |
| **By when** | The target date for completion |
| **How will I know** | The success indicators |
| **Review status** | Current status (Achieved, In progress, Changed) |

---

## Business Rules

### 1. Read-Only Mode
- When viewing a versioned (historical) plan, all tables are read-only
- Users can view content but cannot add, edit, or delete actions
- A message appears: "This is a versioned plan. You can view the content but cannot make changes."

### 2. Row Interaction
- Clicking on any row opens the edit modal for that action
- In read-only mode, row clicks do nothing

### 3. Sorting
- Within each table, items are sorted so that incomplete actions appear first
- Completed/achieved items appear at the bottom of the table

### 4. Empty State
- If no actions exist, the table displays with no rows
- An "Add Action" button is visible (unless in read-only mode)

### 5. Version Carryover
- When a new plan version is created, only **active (non-completed)** actions are copied forward
- Achieved items do not appear in subsequent versions to prevent clutter

### 6. Data Storage
- Actions are stored in the `plan_sections.fields` JSONB column
- Default actions use the `actions` array on the section
- Custom tables (like Behavioural/Emotional Support) use named field keys (e.g., `behavioural_actions`)

---

## How My Goal Plan Tables Feed Into "My Plan Summary"

The **My Plan Summary** section provides a consolidated view of all actions across the entire plan. Here's how it works:

### Data Aggregation
1. The Summary section iterates through all sections in the plan
2. For each section, it extracts all actions from the default `actions` array
3. Each action is tagged with its originating section's category name

### Display Structure
The Summary table shows the same columns as individual section tables:
- Category
- Needs & Goals
- Action
- Who's responsible
- By when
- How will I know
- Review status
- **Status** (calculated badge — see below)

### Status Badge Logic
The Summary adds a calculated "Status" column that shows:

| Badge | Condition |
|-------|-----------|
| **Complete** | Action is marked as completed |
| **Overdue** | Deadline has passed and not completed |
| **Due Today** | Deadline is today |
| **Upcoming** | Deadline is in the future |
| **Not Scheduled** | No deadline set |
| **Hidden** | Status badge is hidden for "Achieved" items (review_status = 'achieved') |

### Visual Highlighting
- **Achieved items**: Sorted to the bottom of the table and highlighted with a green background
- **Active items**: Displayed at the top in the default style

### Summary Statistics
Three coloured stat boxes appear above the table:
- **Green - Achieved**: Count of items with review_status = "Achieved"
- **Blue - In Progress**: Count of items with review_status = "In progress"
- **Amber - Not Started**: Count of items with no review_status or review_status = ""

---

## Important Notes

1. **The "Done" checkbox has been removed** - Completion tracking now uses the Review Status dropdown exclusively

2. **Timeline column removed** - Goal plan tables no longer include timeline visibility toggles; this is managed separately on the dashboard

3. **My Goal Plan vs Action Plan** - The feature was rebranded from "Action Plan" to "My Goal Plan" to better reflect its purpose of tracking goals rather than just tasks

4. **Cultural Context** - Prompts and guidance incorporate te reo Māori terminology reflecting the cultural context of Oranga Tamariki's user base

---

## Future Considerations (Out of Scope for This Story)

- Impact on the landing page/dashboard Plan Summary table (separate Jira)
- Export functionality for goal plan data
- Notification/reminder system for upcoming deadlines
