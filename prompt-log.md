## Task 1 — Sector Selection

**Objective:** Select a sector, identify a local challenge, and propose a feasible frontend solution.

| Item | Details |
|---|---|
| Sector | Health & Wellness Innovation |
| Local Challenge | Students and community residents often struggle to keep consistent daily wellness habits (hydration, activity, sleep) and may lack easy-to-understand, reliable health information. |
| Target Users | Students, young adults, and community residents |
| Proposed Project | WellNest: A Health and Wellness Companion |
| Key Features | 1. Daily Wellness Tracker. 2. Educational Health Library (labeled educational only). 3. In-page Wellness Reminders (active while page is open). |

---

## Task 2 — Zero-Shot Prompting

**Objective:** Observe what an AI generates from a basic prompt without examples, and preserve it as the baseline.

**Exact Prompt:**
> Create a simple webpage that helps students track their daily wellness habits.

**Actual AI Output:**
Model used: Claude (Anthropic)
Saved files: `outputs/task2-zero-shot/index.html`, `outputs/task2-zero-shot/style.css`, `outputs/task2-zero-shot/script.js`

Generated a single page titled "Daily Wellness Tracker" with a water counter (+/- buttons), an exercise-minutes input, a sleep-hours input, a four-item habit checklist, and a "Save Today's Progress" button that stores the entry in localStorage.

**What Worked:**
- Interactive tracker on first try (water counter, inputs, checkboxes).
- Simple, readable layout; includes a viewport meta tag and a single-column layout that should suit mobile.

**What Needs Improvement:**
- Does not name WellNest or identify the target community.
- No educational health library and no reminders (two of three planned features missing).
- No "educational only, not medical advice" label.
- Saved data is never reloaded when the page reopens, so saving has no visible effect after refresh.
- Inputs have no `<label>` elements (placeholders only); checkboxes are not associated with their text; buttons use inline `onclick`.
- No `header`/`main`/`section` semantic structure and no visible focus styling.


**Next Action / Verification:**
Open `index.html`, test with mouse and keyboard, resize to mobile width, then write the Task 3 structured prompt (Role, Task, Context, Constraints, Expected Output, Acceptance Criteria) and compare against this baseline.

---

## Task 3 — Anatomy of a Prompt (Role · Task · Context · Constraints · Expected Output · Acceptance Criteria)

**Objective:** Improve output relevance using structured prompt components, then compare against the Task 2 baseline.

**Exact Prompt:**
> Act as a frontend web developer. Create a responsive single-page web prototype called WellNest: A Health and Wellness Companion for students and community residents in the Philippines who want to build consistent daily wellness habits. Include three features: (1) a daily wellness tracker for water intake, physical activity, sleep, and user-set goals, saved in the browser; (2) an educational health library on nutrition, exercise, hygiene, and stress management with a topic filter; (3) user-configured wellness reminders that work only while the page is open. Use semantic HTML, CSS, and vanilla JavaScript only. Do not use external frameworks, backend services, or APIs. Use fictional demonstration content, keep a visible "educational only, not medical advice" notice, and do not recommend specific health numbers or give diagnoses. Provide index.html, style.css, and script.js. Acceptance criteria: the tracker saves and reloads entries; every input has a visible label; all controls work with mouse and keyboard with visible focus; the layout is readable on mobile screens; the library filter works; the page states the reminder limitation.

**Actual AI Output:**
Model used: Claude (Anthropic)
Saved files: `outputs/task3-structured/index.html`, `outputs/task3-structured/style.css`, `outputs/task3-structured/script.js`

Generated a responsive single-page WellNest prototype containing:
- A header with the WellNest name and a visible "Educational demo only" notice, plus a skip link and section navigation.
- A Daily Wellness Tracker with labeled inputs for water, activity, sleep, and user-set goals, a personal daily goal field, save and clear buttons, and progress bars. Entries are saved to localStorage and reloaded when the page opens.
- An Educational Health Library with eight demonstration cards across Nutrition, Exercise, Hygiene, and Stress Management, filtered by a topic dropdown.
- A Wellness Reminders section where users choose a reminder and an interval in minutes. It states that reminders work only while the page is open and shows an alert message when one fires.

Baseline for comparison: `outputs/task2-zero-shot/`

**Differences compared with the zero-shot baseline:**
1. Identity and scope: Task 2 was a generic "Daily Wellness Tracker." Task 3 is named WellNest and includes all three planned features (tracker, library, reminders). The baseline had only the tracker.
2. Safety and honesty: Task 3 shows an "educational only, not medical advice" notice and states that reminders work only while the page is open. The baseline had neither.
3. Persistence: Task 3 reloads saved entries on page load. The baseline saved to localStorage but never read it back.
4. Accessibility: Task 3 has a label for every input, semantic landmarks (`header`, `nav`, `main`, `section`, `footer`), a skip link, and visible focus styles. The baseline used placeholders and `div` containers.
5. Goals: Task 3 lets users set their own goals instead of leaving them implied.

**What Worked:**
- Every requirement named in the prompt appears in the output.
- Constraints were followed: no frameworks, no APIs, demo content only, no health numbers recommended.

**What Needs Improvement (to confirm by testing):**
- Not yet tested by me: keyboard-only use, phone-width layout, and the reminder timer firing (try a 1-minute reminder).
- Reminders disappear on page refresh (by design, but worth noting).
- Library content is short placeholder text and should be reviewed for accuracy.


**Next Action / Verification:**
Open `outputs/task3-structured/index.html`. Check: Tab through all controls; save, refresh, and confirm values return; filter the library; add a 1-minute reminder and wait; resize to about 375px wide. Record results here, then continue to Task 4.

---

## Task 4 — Few-Shot and Role Assignment

### Experiment A: Few-Shot Prompting

**Objective:** Observe how examples of the expected format influence the generated items.

**Exact Prompt:**
> Create daily wellness checklist items using this format:
> Example 1:
> Item: Water bottle
> Category: Hydration
> Description: Keep a water bottle within reach while studying.
> Example 2:
> Item: Short stretch break
> Category: Activity
> Description: Stand up and stretch after sitting for a while.
> Generate four additional general wellness items using the same format and render them as a checklist on the WellNest page.

**Actual AI Output:**
Model used: Claude (Anthropic)
Saved files: `outputs/task4a-few-shot/response.md`, `index.html`, `style.css`, `script.js`

Generated four items in the demonstrated Item / Category / Description format: Regular meal times (Nutrition), Wash hands (Hygiene), Wind-down routine (Sleep), and Mindful pause (Stress Management). The page now renders all six items as a "Daily Wellness Checklist" with native checkboxes and linked labels. Checked items are saved in localStorage, and a Reset button clears them.

**What Worked:**
- Every new item followed the same three-field structure and a similar one-sentence, non-prescriptive tone, with no health numbers.
- Test run: the page rendered 6 checkboxes, every checkbox had a linked label, and ticking one stored `["habit-0"]` in localStorage.

**What Needs Improvement:**
- The categories overlap with the library topics but are not identical (Sleep and Hydration are not library topics).
- The checklist has no completion summary and is not grouped with a `fieldset`/`legend`.

**Next Action / Verification:**
Tick items, refresh the page, and confirm the checked items remain checked.

### Experiment B: Role Assignment

**Objective:** Examine the interface from a specialized accessibility perspective.

**Exact Prompt:**
> Act as a frontend accessibility reviewer. Examine the WellNest page. Identify problems involving HTML semantics, keyboard access, labels, and visual clarity. Recommend targeted improvements without changing the project's scope.

**Actual AI Output:**
Model used: Claude (Anthropic)
Saved file: `outputs/task4b-role-assignment/response.md`

The review reported five findings: a low-contrast focus outline (`#ffb703`), no announcement when the library filter or checklist changes, ungrouped related controls (no `fieldset`/`legend`), long checkbox labels, and no custom validation text for number inputs. It also listed positives (landmarks, skip link, linked labels, native checkboxes, `role="status"` and `role="alert"` regions).

**What Worked:**
- The role produced concerns that the earlier prompts did not raise: focus visibility, screen reader announcements, and control grouping.
- Recommendations stayed within the project's scope.

**What Needs Improvement:**
- Findings came from reading the code, not from a screen reader or a keyboard test, so they need verification (done in Task 5).

**Next Action / Verification:**
Select the two most important findings and apply and test them in Task 5.

---

## Task 5 — Structured Analysis and Refinement

**Objective:** Use AI-assisted analysis to identify and fix a specific implementation weakness, then verify it.

**Exact Prompt:**
> Review my WellNest page against its requirements. Check whether the checklist works correctly, whether the HTML uses appropriate semantic elements, and whether the interface is usable on mobile screens and with a keyboard. Identify the two most important implementation issues based on the provided code. Recommend the smallest appropriate corrections and explain how I can test them.

**Actual AI Output:**
Model used: Claude (Anthropic)
Saved file: `outputs/task5-analysis/response.md`
Refined version: `outputs/task5-refined/`

Identified two issues: (1) the focus outline `#ffb703` has about 1.75:1 contrast on white; (2) the library filter and checklist changes are not announced. The recommended corrections were a darker outline color (`#0b4fb3`) and two `role="status" aria-live="polite"` messages.

**What Worked:**
- Both issues were specific, based on the actual code, and fixable with small edits.

**What Needs Improvement:**
- The correction only adds announcements; a real screen reader test would confirm they are read aloud.

**Next Action / Verification (results):**
Applied both corrections in `outputs/task5-refined/` (`style.css`, `index.html`, `script.js`).
- Contrast calculation: the old outline measured 1.75:1 on white and 1.63:1 on the page background. The new outline measures 7.54:1 on white and 7.03:1 on the page background.
- Automated DOM test on the refined page:
  - Initial status: "0 of 6 habits completed" and "Showing 8 of 8 items".
  - After ticking two items: "2 of 6 habits completed", and localStorage held `["habit-0","habit-3"]`.
  - After Reset: "0 of 6 habits completed".
  - After filtering to Hygiene: "Showing 2 of 8 items", with 2 cards displayed.
- Before the fix, the same test found neither status element on the 4A page.
- [Add your own result: press Tab through the refined page and note the focus outline visibility.]

---

## Task 6 — Compare and Submit

### Final Comparison

| Technique | Observation |
|---|---|
| Zero-Shot | The AI assumed a generic "daily wellness tracker" for students. It omitted the WellNest name, target community, library, reminders, medical disclaimer, saved-data reload, labels, and semantic structure. |
| Structured Prompt | Naming the three features, the vanilla stack, acceptance criteria, and the educational-only constraint produced a complete WellNest page: tracker with reload, filterable library, in-page reminders, labeled inputs, semantic landmarks, and a visible disclaimer. |
| Few-Shot | The checklist items became consistent in structure (Item / Category / Description), tone, and length, and rendered with the same markup. |
| Role Assignment | The accessibility reviewer raised focus contrast, silent dynamic updates, ungrouped controls, long labels, and validation text, which the earlier prompts did not mention. |
| Structured Analysis | The focus outline contrast was raised from 1.75:1 to 7.54:1 on white, and the status messages were verified by a DOM test (checklist count, reset, and library result count). |

### Selected Version
`outputs/task5-refined/` (also copied to the project root as `index.html`, `style.css`, `script.js`). It meets the original requirements: three features, frontend only, demonstration data, a visible educational notice, and the accessibility corrections from Task 5.

### Final Reflection
Structured prompting produced the most useful initial implementation because it defined the features, technologies, constraints, and acceptance criteria. Few-shot prompting standardized the checklist content, and role assignment surfaced accessibility concerns that I had not asked about directly. Structured analysis turned one of those concerns into a measurable fix. I learned that generated output still needs inspection and testing before acceptance. The automated checks above support the changes but do not replace testing with a keyboard, a phone-sized screen, and a screen reader. [Edit this reflection in your own words and add what you observed while testing.]